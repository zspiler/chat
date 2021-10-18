const express = require("express");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
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
	limits: {
		fileSize: 10000000,
	},
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
			req.fileValidationError =
				"Submitted file must be in PNG or JPG format";
			return cb(new Error("Submitted file must be in PNG or JPG format"));
		}
	},
}).single("picture");

// POST api/auth/signup
// Create new user and log them in

router.post(
	"/signup",
	body("username").isLength({ min: 5 }),
	body("password").isLength({ min: 6 }),
	async (req, res) => {
		upload(req, res, async (err) => {
			if (err) {
				return res.status(422).json({ message: err.message });
			}

			const { username, password } = req.body;

			const validationErrors = validationResult(req.body);
			if (!validationErrors.isEmpty()) {
				return res
					.status(400)
					.json({ errors: validationErrors.array() });
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
			const token = jwt.sign(
				{ username, id: user._id },
				process.env.JWT_SECRET,
				{
					expiresIn: 86400,
				}
			);
			res.cookie("chat_token", token, {
				maxAge: 86400 * 1000,
				httpOnly: true,
				sameSite: process.env.NODE_ENV === "production",
			});
			res.json({
				message: "Successfully registered user",
				token,
				username,
				profilePicture: user.profilePicture,
				id: user._id,
			});
		});
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
			const token = jwt.sign(
				{ username, id: user._id },
				process.env.JWT_SECRET,
				{
					expiresIn: 86400,
				}
			);
			res.cookie("chat_token", token, {
				maxAge: 86400 * 1000,
				httpOnly: true,
				sameSite: process.env.NODE_ENV === "production",
			});
			res.json({
				message: "Successfully logged in",
				token,
				username,
				profilePicture: user.profilePicture,
				id: user._id,
			});
		} else {
			return res.status(401).json({ message: "Wrong password" });
		}
	}
});

// POST api/auth/user
// Return user info and refresh cookie + token

router.post("/token", auth, async (req, res) => {
	const username = jwt_decode(req.cookies.chat_token).username;
	const user = await User.findOne({ username });
	if (!user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const token = jwt.sign({ username, id: user._id }, process.env.JWT_SECRET, {
		expiresIn: 86400,
	});
	res.cookie("chat_token", token, {
		maxAge: 86400 * 1000,
		httpOnly: true,
		sameSite: process.env.NODE_ENV === "production",
	});

	res.json({
		message: "Refreshed token",
		token,
		username,
		profilePicture: user.profilePicture,
	});
});

// POST api/auth/logout
// Log user out

router.post("/logout", auth, (_, res) => {
	res.clearCookie("chat_token");
	return res.json({ message: "Successfully logged out" });
});

module.exports = router;
