import React, { useState, useEffect } from "react";
import { w3cwebsocket } from "websocket";

import { FiSend } from "react-icons/fi";

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
				try {
					// const { author, text, _id } = JSON.parse(message.data);
					const msg = JSON.parse(message.data);
					setMessages((previousState) => [...previousState, msg]);
				} catch (error) {
					// TODO:
					console.log("Error!");
					console.log(error);
				}
			};
			return wsClient;
		});
	}, []);

	function sendMessage() {
		if (textInput.length > 0) {
			client.send(
				JSON.stringify({
					text: textInput,
				})
			);
			setTextInput("");
		}
	}
	// TODO: message must be  > 0, <= 1000

	function onInputChange(event) {
		if (textInput.length < 1000) {
			setTextInput(event.target.value);
		}
	}

	return (
		// <div>

		// 	<input
		// 		className="shadow border rounded"
		// 		type="text"
		// 		onChange={onInputChange}
		// 		value={textInput}
		// 	/>
		// 	<button
		// 		className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
		// 		onClick={sendMessage}
		// 	>
		// 		send
		// 	</button>
		// 	{/* </form> */}

		// 	{messages.map((message) => (
		// 		<div>
		// 			Author: {message.author} Text: {message.text}
		// 		</div>
		// 	))}
		// </div>
		// TODO: message component
		<div className="h-screen bg-gray-300 overflow-auto">
			<div className="flex justify-center items-center h-screen ">
				<div className="w-5/12 h-100 bg-white rounded shadow-2xl">
					<nav className="w-full h-14 border-b border-gray-200 rounded-tr rounded-tl flex justify-between items-center">
						<div className="flex justify-center items-center p-1">
							<i className="mdi mdi-arrow-left font-normal text-gray-300 ml-1"></i>{" "}
							<img
								src="https://i.imgur.com/IAgGUYF.jpg"
								className="rounded-full ml-2 w-10 h-10"
							/>
							<span className="text-sm font-medium text-gray-600 ml-2">
								Alex cairo
							</span>
						</div>
					</nav>
					<div
						className="overflow-auto px-1 py-1"
						style={{ height: "19rem" }}
						id="journal-scroll"
					>
						{/* MESSAGE (OTHER) */}
						<div className="flex items-center mt-2">
							<img
								src="https://i.imgur.com/IAgGUYF.jpg"
								className="rounded-full shadow-xl w-5 h-5 mr-2"
							/>
							<span className="flex h-auto bg-gray-300 text-gray-800 text-xs text-xs font-normal rounded-lg rounded-bl-none p-2 items-end">
								Hi Dr.Hendrikson, I haven't been feeling well
								for past few days.
								<span
									className="text-gray-500 pl-1"
									style={{ fontSize: "8px" }}
								>
									01:25am
								</span>
							</span>
						</div>

						{/* MESSAGE (USER) */}
						<div className="flex justify-end items-end mt-2">
							{/* <span
								className="bg-purple-500 h-auto text-gray-200 text-xs font-normal rounded-br-none rounded-lg p-2 items-end flex justify-end"
								style={{ fontSize: "10px" }}
							> */}
							<span className="bg-purple-500 h-auto text-gray-200 rounded-br-none text-xs rounded-lg p-2 items-end flex justify-end">
								Lets jump on a video call.
								<span
									className="text-gray-300 pl-1"
									style={{ fontSize: "8px" }}
								>
									02.30am
								</span>
							</span>
							<img
								src="https://i.imgur.com/IAgGUYF.jpg"
								className="rounded-full shadow-xl h-5 w-5 ml-2"
							/>
						</div>
					</div>

					<div className="flex justify-between items-center px-1 border-t border-gray-200">
						<input
							type="text"
							className="h-8 w-11/12 mx-2 text-xs pl-5 pr-20 bg-gray-100 rounded-lg z-0 focus:shadow focus:outline-none"
							placeholder="Write something..."
						/>
						<div className="m-3 h-8 w-8 flex justify-center align-middle bg-purple-500 rounded-full p-1 transform hover:shadow-lg hover:bg-purple-600 cursor-pointer ">
							<FiSend
								style={{ color: "white", margin: "auto" }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default DirectChat;
