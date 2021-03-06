const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	const token = req.cookies.chat_token;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	try {
		const tokenData = jwt.verify(token, process.env.JWT_SECRET);
		req.username = tokenData.username;
		req.id = tokenData.id;
		next();
	} catch (err) {
		res.status(401).json({ message: "Invalid token" });
	}
};
