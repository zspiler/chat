const express = require("express");
const { validationResult, body, query } = require("express-validator");
const jwt_decode = require("jwt-decode");

const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");

// GET api/users/search
// Search users, excluding users already in conversation with

router.get("/search", auth, query("username").notEmpty(), async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(400).json({ errors: validationErrors.array() });
	}

	const user = await User.findOne({
		username: req.username,
	});

	// Find users already in conversation with
	let knownUsers = [];
	for (let i = 0; i < user.conversations.length; i++) {
		const u = (await Conversation.findById(user.conversations[i])).users;
		u.forEach((u) => {
			knownUsers.push(u._id.toString());
		});
	}

	User.find(
		{
			username: {
				$regex: new RegExp(req.query.username),
				$options: "i",
			},
		},
		function (err, users) {
			if (err) {
				res.status(401).json({ message: "Server error" });
				return;
			}

			res.json(
				// Exclude known users
				users.reduce(function (filtered, user) {
					if (!knownUsers.includes(user._id.toString())) {
						filtered.push({
							username: user.username,
							id: user._id,
							profilePicture: user.profilePicture,
						});
					}
					return filtered;
				}, [])
			);
		},
		{ limit: 15 }
	);
});

// POST api/users/block
// Block a user

router.post("/block", auth, body("username").notEmpty(), async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(400).json({ errors: validationErrors.array() });
	}

	const loggedInUser = await User.findOne({
		username: jwt_decode(req.cookies.chat_token).username,
	}).exec();

	const userToBlock = await User.findOne({
		username: req.body.username,
	}).exec();

	if (!userToBlock) {
		return res.status(404).json({ message: "Cannot find user" });
	}

	// Check if user already blocked

	if (loggedInUser.blocked.includes(userToBlock._id)) {
		return res.status(200).json({ message: "User already blocked" });
	}
	loggedInUser.blocked.push(userToBlock._id);
	loggedInUser.save();

	return res.status(200).json({ message: "User blocked" });
});

module.exports = router;
