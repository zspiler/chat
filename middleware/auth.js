const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	if (process.env.NODE_ENV !== "development") {
		const token = req.cookies.chat_token;
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		try {
			const tokenData = jwt.verify(token, process.env.JWT_SECRET);
			req.username = tokenData.username;
			next();
		} catch (err) {
			res.status(401).json({ message: "Invalid token" });
		}
	} else {
		next();
	}
};
