const express = require("express");
const mongoose = require("mongoose");
const { validationResult, body } = require("express-validator");

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
// Get data on users in conversation

router.get("/:conversationId", auth, async (req, res) => {
	const { conversationId } = req.params;

	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(400).json({ errors: validationErrors.array() });
	}

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
		return res.status(401).json({ message: "Unauthorized" });
	}

	const conversation = await Conversation.findById(conversationId);

	const users = [];
	for (let i = 0; i < conversation.users.length; i++) {
		users.push(await User.findById(conversation.users[i]._id));
	}

	res.json({
		users: users.map((user) => {
			return {
				username: user.username,
				profilePicture: user.profilePicture,
			};
		}),
	});
});

module.exports = router;
