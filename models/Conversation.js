const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "user",
		},
	],
	messages: [
		{
			author: {
				type: Schema.Types.ObjectId,
				ref: "user",
				required: true,
			},
			text: {
				type: String,
				required: true,
			},
			time: {
				type: Date,
				default: Date.now,
				required: true,
			},
			seen: {
				type: Boolean,
				default: false,
				required: true,
			},
		},
	],
	latestMessage: {
		type: {
			author: {
				type: Schema.Types.ObjectId,
				ref: "user",
				required: true,
			},
			text: {
				type: String,
				required: true,
			},
			time: {
				type: Date,
				default: Date.now,
				required: true,
			},
			seen: {
				type: Boolean,
				default: false,
				required: true,
			},
		},
		required: false,
	},
});

Conversation = mongoose.model("conversation", ConversationSchema);
module.exports = Conversation;
