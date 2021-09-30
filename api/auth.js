const express = require("express");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const multer = require("multer");

const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");

const upload = multer({
	storage: multer.diskStorage({
		destination: function (_, _, cb) {
			cb(null, `${__dirname}/../public/images`);
		},
		filename: function (_, file, cb) {
			cb(null, file.fieldname + "-" + Date.now());
		},
	}),
});

// POST api/auth/signup
// Create new user and log them in

router.post(
	"/signup",
	body("username").isLength({ min: 5 }),
	body("password").isLength({ min: 6 }),
	upload.single("picture"),
	async (req, res) => {
		const { username, password } = req.body;

		const validationErrors = validationResult(req.body);
		if (!validationErrors.isEmpty()) {
			return res.status(400).json({ errors: validationErrors.array() });
		}

		// Check if username taken
		const exists = await User.exists({ username });
		if (exists) {
			return res.status(409).json({ message: "Username taken" });
		}

		const user = new User({
			username,
			password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
		});
		if (req.file) {
			user.profilePicture = req.file.filename;
		}

		await user.save();

		// Log user in
		const token = jwt.sign({ username }, process.env.JWT_SECRET, {
			expiresIn: 86400,
		});
		res.cookie("chat_token", token, {
			maxAge: 86400 * 1000,
			httpOnly: true,
			sameSite: process.env.NODE_ENV === "production",
		});
		res.json({ message: "Successfully registered user", token, username });
	}
);

// POST api/auth/login
// Log user in

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	// Check if user exists
	const user = await User.findOne({ username });
	if (!user) {
		return res.status(401).json({ message: "User does not exist" });
	} else {
		const passwordValid = await bcrypt.compare(password, user.password);
		if (passwordValid) {
			// Create token
			const token = jwt.sign({ username }, process.env.JWT_SECRET, {
				expiresIn: 86400,
			});
			res.cookie("chat_token", token, {
				maxAge: 86400 * 1000,
				httpOnly: true,
				sameSite: process.env.NODE_ENV === "production",
			});
			res.json({ message: "Successfully logged in", token, username });
		} else {
			return res.status(401).json({ message: "Wrong password" });
		}
	}
});

// POST api/auth/user
// Return user info and refresh cookie + token

router.post("/token", auth, async (req, res) => {
	const username = jwt_decode(req.cookies.chat_token).username;

	const token = jwt.sign({ username }, process.env.JWT_SECRET, {
		expiresIn: 86400,
	});
	res.cookie("chat_token", token, {
		maxAge: 86400 * 1000,
		httpOnly: true,
		sameSite: process.env.NODE_ENV === "production",
	});
	res.json({ message: "Refreshed token", token, username });
});

// POST api/auth/logout
// Log user out

router.post("/logout", auth, (_, res) => {
	res.clearCookie("chat_token");
	return res.json({ message: "Successfully logged out" });
});

router.post("/protected", auth, (req, res) => {
	console.log("protected access");
	res.send("ok");
});

module.exports = router;
