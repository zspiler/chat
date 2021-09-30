const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	profilePicture: {
		type: String,
		required: true,
		default: "default.png",
	},
	// friends: [
	// 	{
	// 		type: Schema.Types.ObjectId,
	// 		ref: "user",
	// 	},
	// ],
	blocked: [
		{
			type: Schema.Types.ObjectId,
			ref: "user",
		},
	],
});

User = mongoose.model("user", UserSchema);
module.exports = User;
