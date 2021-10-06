const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

// connect to mongo
(async function () {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("Connected to db");
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
})();

const app = express();
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		exposedHeaders: ["set-cookie"],
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// enable WS
require("express-ws")(app);

app.use("/api/auth", require("./api/auth"));
app.use("/api/users", require("./api/users"));
app.use("/api/conversations", require("./api/conversations"));
app.use("/api/chat", require("./api/chat"));

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on port ${port}`));
