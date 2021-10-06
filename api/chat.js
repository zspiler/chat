const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");

const User = require("../models/User");
const Conversation = require("../models/Conversation");

const router = express.Router();

router.ws("/direct/:conversationId", async function (ws, req) {
	console.log(`New connection to ${req.params.conversationId}`);
	const conversationId = req.params.conversationId;

	// Validate token
	const token = req.cookies.chat_token;
	if (!token) {
		ws.send("Error: Unauthorized");
		ws.close();
	}
	try {
		const tokenData = jwt.verify(token, process.env.JWT_SECRET);
		req.username = tokenData.username;
	} catch (_) {
		ws.send("Error: Invalid token");
		ws.close();
	}

	// Check conversation exists
	const exists = await Conversation.exists({
		_id: conversationId,
	});
	if (!exists) {
		ws.send("Error: Conversation does not exist");
		ws.close();
	}

	const loggedInUser = await User.findOne({
		username: req.username,
	}).exec();

	// Check conversation in user's conversations
	if (
		!loggedInUser.conversations.includes(
			mongoose.Types.ObjectId(conversationId)
		)
	) {
		ws.send("Error: Not permitted");
		ws.close();
	}

	ws.on("message", async function (message) {
		// TODO: confirm message saved?
		// TODO: validate text, error back?
		const payload = JSON.parse(message);

		await Conversation.findOneAndUpdate(
			{ _id: conversationId },
			{
				$push: {
					messages: {
						author: loggedInUser._id,
						text: payload.text,
					},
				},
			}
		);
	});

	ws.on("close", function () {
		console.log("closed connection");
	});
});

// TODO: 404 ?

module.exports = router;
