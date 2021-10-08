const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const User = require("../models/User");
const Conversation = require("../models/Conversation");

const router = express.Router();

// Stores active conversations (users + socket for conversation)
const conversations = {};

router.ws("/direct/:conversationId", async function (ws, req) {
	console.log("connect");
	const { conversationId } = req.params;

	// Authorize user
	const user = await authorize(ws, req);
	if (!user) {
		return;
	}

	// Add user to 'conversations'
	if (conversationId in conversations) {
		const userExists = conversations[conversationId].find((el) => {
			return String(el.user) === String(user._id);
		});
		if (!userExists) {
			conversations[conversationId].push({ user: user._id, socket: ws });
		}
	} else {
		conversations[conversationId] = [{ user: user._id, socket: ws }];
	}

	// Fetch sorted messages
	const convo = (
		await Conversation.aggregate([
			{ $match: { _id: new mongoose.mongo.ObjectId(conversationId) } },
			{ $unwind: "$messages" },
			{ $sort: { "messages.time": 1 } },
			{
				$group: {
					messages: { $push: "$messages" },
					_id: 1,
				},
			},
			{
				$project: {
					_id: 0,
					messages: 1,
				},
			},
		]).exec()
	)[0];

	for (let i = 0; i < convo.messages.length; i++) {
		const message = convo.messages[i];

		// add user obj, format date
		message.author = await User.findById(message.author);
		const dateTime = message.time;
		message.time = moment(dateTime).format("hh:mm A");
		message.date = moment(dateTime).format("MMM Do, YYYY");

		ws.send(JSON.stringify(message));
	}

	ws.on("message", async function (message) {
		const payload = JSON.parse(message);

		// TODO: catch any parse errors, check for <script> etc

		// Validate message
		if (payload.text.length < 1 || payload.text.length > 1000) {
			ws.close(1009, "Message must be 1 <= 1000 characters long");
			return false;
		}

		const updatedConvo = await Conversation.findOneAndUpdate(
			{ _id: conversationId },
			{
				$push: {
					messages: {
						author: user._id,
						text: payload.text,
					},
				},
			},
			{ new: true }
		).lean();

		// add user obj, format date
		const newMessage =
			updatedConvo.messages[updatedConvo.messages.length - 1];
		newMessage.author = user;
		const dateTime = newMessage.time;
		newMessage.time = moment(dateTime).format("hh:mm A");
		newMessage.date = moment(dateTime).format("MMM Do, YYYY");

		// Send message to all (both) participants in conversation
		for (var i = 0; i < conversations[conversationId].length; i++) {
			conversations[conversationId][i].socket.send(
				JSON.stringify(newMessage)
			);
		}
	});

	ws.on("close", function () {
		// Remove user from conversation
		const i = conversations[conversationId].findIndex(
			(p) => p.user === user._id
		);
		conversations[conversationId].splice(i);
	});
});

// Verify token, check conversation permissions
async function authorize(ws, req) {
	// Validate token
	const token = req.cookies.chat_token;
	if (!token) {
		ws.close(1003, "Unauthorized");
		return false;
	}
	try {
		const tokenData = jwt.verify(token, process.env.JWT_SECRET);
		req.username = tokenData.username;
	} catch (_) {
		ws.close(1003, "Invalid token");
		return false;
	}

	// Check conversation exists
	const exists = await Conversation.exists({
		_id: req.params.conversationId,
	});
	if (!exists) {
		ws.close(1003, "Conversation does not exist");
		return false;
	}

	const user = await User.findOne({
		username: req.username,
	}).exec();

	// Check conversation in user's conversations
	if (
		!user.conversations.includes(
			mongoose.Types.ObjectId(req.params.conversationId)
		)
	) {
		ws.close(1003, "Not permitted");
		return false;
	}
	return user;
}

module.exports = router;
