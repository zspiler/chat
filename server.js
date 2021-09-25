const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// app.use(cookieParser());
// app.use(
//   jwt({
//     secret: 'secret123',
//     getToken: req => req.cookies.token
//   })
// );

require("dotenv").config();

// Connect to MongoDB
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

app.use("/api/auth", require("./api/auth"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on port ${port}`));