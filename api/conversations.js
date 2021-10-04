const express = require("express");
const mongoose = require("mongoose");
const { validationResult, body, query } = require("express-validator");

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

// PUT api/messages
// Send message to conversation
router.put(
	"/",
	auth,
	body("conversationId").notEmpty(),
	body("text").notEmpty(),
	body("text").isLength({ max: 1000 }),
	async (req, res) => {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			return res.status(400).json({ errors: validationErrors.array() });
		}

		// Check conversation exists
		const exists = await Conversation.exists({
			_id: req.body.conversationID,
		});
		if (!exists) {
			return res
				.status(404)
				.json({ message: "Conversation does not exist" });
		}

		const loggedInUser = await User.findOne({
			username: req.username,
		}).exec();

		// Check conversation in user's conversations
		if (
			!loggedInUser.conversations.includes(
				new mongoose.Types.ObjectId(req.body.conversationId)
			)
		) {
			return res.status(409).json({ message: "Unauthorized" });
		}

		await Conversation.findOneAndUpdate(
			{ _id: req.body.conversationId },
			{
				$push: {
					messages: {
						author: loggedInUser._id,
						text: req.body.text,
					},
				},
			}
		);
		res.json({ messages: "Successfuly sent message" });
	}
);

module.exports = router;
