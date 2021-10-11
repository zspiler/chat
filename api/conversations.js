const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");

const { validationResult, body, param } = require("express-validator");

const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");

const Conversation = require("../models/Conversation");

// POST api/conversations
// Create conversation

router.post("/", auth, body("username").notEmpty(), async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(400).json({ errors: validationErrors.array() });
	}

	const loggedInUser = await User.findOne({
		username: req.username,
	}).exec();

	const otherUser = await User.findOne({
		username: req.body.username,
	}).exec();

	if (!(loggedInUser && otherUser)) {
		return res.status(404).json({ message: "Unknown user" });
	}

	// Check if conversation between two exists
	const exists = await Conversation.exists({
		users: { $all: [loggedInUser._id, otherUser._id] },
	});
	if (exists) {
		return res.status(422).json({ message: "Conversation already exists" });
	}

	// Create conversation
	const _id = mongoose.Types.ObjectId();
	const conversation = new Conversation({
		_id,
		users: [loggedInUser._id, otherUser._id],
		messages: [],
	});
	await conversation.save();
	console.log("saved convo");

	// Add conversations to users
	await User.findOneAndUpdate(
		{ _id: loggedInUser._id },
		{
			$push: {
				conversations: _id,
			},
		}
	);

	await User.findOneAndUpdate(
		{ _id: otherUser._id },
		{
			$push: {
				conversations: _id,
			},
		}
	);

	res.json({ messages: "Successfuly created conversation", _id });
});

// GET api/conversations/:conversationId
// Get conversationn

router.get("/:conversationId", auth, async (req, res) => {
	const { conversationId } = req.params;

	// Check conversation exists
	const exists = await Conversation.exists({
		_id: mongoose.Types.ObjectId(conversationId),
	});
	if (!exists) {
		return res.status(404).json({ message: "Conversation does not exist" });
	}

	// Check user is in conversation
	const user = await User.findOne({
		username: req.username,
	}).exec();

	if (!user.conversations.includes(mongoose.Types.ObjectId(conversationId))) {
		return res.status(403).json({ message: "Not permitted" });
	}

	const conversation = await Conversation.findById(conversationId);

	// Sort messages
	let messages = [];
	if (conversation.messages.length > 0) {
		messages = (
			await Conversation.aggregate([
				{
					$match: {
						_id: new mongoose.mongo.ObjectId(conversationId),
					},
				},
				{ $unwind: "$messages" },
				{ $sort: { "messages.time": 1 } },
				{
					$group: {
						messages: { $push: "$messages" },
						_id: 1,
					},
				},
			]).exec()
		)[0].messages;
	}

	if (messages)
		for (let i = 0; i < messages.length; i++) {
			const message = messages[i];
			// add user obj, format date
			const { username, profilePicture } = await User.findById(
				// TODO: garbage
				message.author
			);
			message.author = { username, profilePicture };
			const dateTime = message.time;
			message.time = moment(dateTime).format("hh:mm A");
			message.date = moment(dateTime).format("MMM Do, YYYY");
		}

	const users = [];
	for (let i = 0; i < conversation.users.length; i++) {
		users.push(await User.findById(conversation.users[i]._id));
	}

	res.json({
		messages,
		users: users.map((user) => {
			return {
				username: user.username,
				profilePicture: user.profilePicture,
			};
		}),
	});
});

// GET api/conversations
// Get user's conversations sorted by latest message (without messages)

router.get("/", auth, async (req, res) => {
	const user = await User.findOne({
		username: req.username,
	});

	const conversations = [];

	// TODO: sort by latest message time
	for (let i = 0; i < user.conversations.length; i++) {
		const convo = await Conversation.findById(
			user.conversations[i],
			"-messages"
		).lean();

		let participant = null;
		for (let i = 0; i < convo.users.length; i++) {
			if (req.id.toString() !== convo.users[i].toString()) {
				participant = await User.findById(convo.users[i]);
				break;
			}
		}
		if (convo.latestMessage) {
			convo.latestMessage.dateTime = convo.latestMessage.time;
			convo.latestMessage.time = moment(convo.latestMessage.time).format(
				"hh:mm A"
			);
		}
		conversations.push({
			id: convo._id,
			username: participant.username,
			profilePicture: participant.profilePicture,
			latestMessage: convo.latestMessage || null,
		});
	}

	// Sort by latest message
	conversations.sort((a, b) => {
		if (a.latestMessage.dateTime > b.latestMessage.dateTime) {
			return -1;
		}
		if (a.latestMessage.dateTime < b.latestMessage.dateTime) {
			return 1;
		}
		return 0;
	});

	res.json(conversations);
});

// DELETE api/conversations/:conversationId
// Delete conversation

router.delete(
	"/:conversationId",
	auth,
	param("conversationId").notEmpty(),
	async (req, res) => {
		const { conversationId } = req.params;
		console.log(`delete ${conversationId}`);

		const convo = await Conversation.findById(conversationId);
		if (!convo) {
			return res
				.status(404)
				.json({ message: "Conversation does not exist" });
		}

		// Check user has permissions
		const user = await User.findOne({ username: req.username });
		if (
			!user.conversations
				.map((_id) => _id.toString())
				.includes(conversationId)
		) {
			return res.status(403).json({ message: "Not permitted" });
		}

		const participants = convo.users;

		// Remove conversation document
		await convo.remove((err) => {
			if (err) {
				return res.json({ message: "Failed to delete" });
			}
		});

		// Remove conversations id's from participants
		User.updateMany(
			{ _id: { $in: participants } },
			{ $pull: { conversations: conversationId } },
			function (err, user) {
				if (err) {
					return res.status(500).json({
						message: "Failed to delete conversation from user",
					});
				}
				res.json({ message: "Successfuly deleted conversation" });
			}
		);
	}
);

module.exports = router;
