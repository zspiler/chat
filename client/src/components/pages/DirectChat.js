import React, { useState, useEffect } from "react";
import { w3cwebsocket } from "websocket";

function DirectChat() {
	const [client, setClient] = useState(null);

	const [messages, setMessages] = useState([]);

	const [textInput, setTextInput] = useState("");

	useEffect(() => {
		// initialize WebSocket client
		setClient((_) => {
			const wsClient = new w3cwebsocket(
				"ws://localhost:5000/api/chat/direct/615b4f11fd8bac08c7ff3605"
			);
			wsClient.onopen = () => {
				console.log("Client Connected");
			};
			wsClient.onmessage = (message) => {
				console.log("received ");
				console.log(message);
				try {
					// const { author, text, _id } = JSON.parse(message.data);
					const msg = JSON.parse(message.data);
					setMessages((previousState) => [...previousState, msg]);
					// console.log(messages);
				} catch (error) {
					// TODO:
					console.log("Error!!!");
					console.log(error);
				}
			};
			return wsClient;
		});
	}, []);

	function sendMessage() {
		client.send(
			JSON.stringify({
				text: textInput,
			})
		);
		setTextInput("");
	}

	function onInputChange(event) {
		setTextInput(event.target.value);
	}

	// TODO: message must be  > 0, <= 1000

	return (
		<div>
			{/* <form onSubmit={}> */}

			<input
				className="shadow border rounded"
				type="text"
				onChange={onInputChange}
				value={textInput}
			/>
			<button
				className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				onClick={sendMessage}
			>
				send
			</button>
			{/* </form> */}

			{messages.map((message) => (
				<div>
					Author: {message.author} Text: {message.text}
				</div>
			))}
		</div>
	);
}
export default DirectChat;
