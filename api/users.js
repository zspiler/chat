const express = require("express");

const { validationResult, body, query } = require("express-validator");

const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");

// GET api/users/search
// Search users

router.get("/search", auth, query("username").notEmpty(), async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(400).json({ errors: validationErrors.array() });
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
				users.map((user) => {
					return { username: user.username };
				})
			);
		},
		{ limit: 15 }
	);
});

module.exports = router;
