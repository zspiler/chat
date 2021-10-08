import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { w3cwebsocket } from "websocket";

import { FiSend } from "react-icons/fi";

import MessageBubble from "../MessageBubble";

function DirectChat() {
	const auth = useSelector((state) => state.auth);

	const [client, setClient] = useState(null);

	const [messages, setMessages] = useState([]);
	const [participant, setParticipant] = useState(null);

	const [textInput, setTextInput] = useState("");

	useEffect(() => {
		// Get users' data
		(async function () {
			try {
				const res = await axios.get(
					`/api/conversations/615b4f11fd8bac08c7ff3605`,
					{
						withCredentials: true,
					}
				);
				for (let i = 0; i < res.data.users.length; i++) {
					if (res.data.users[i].username !== auth.username) {
						setParticipant((_) => res.data.users[i]);
						break;
					}
				}
			} catch (err) {
				// TODO: error
				if (err.response.data.message) {
					console.log(err.response.data.message);
				} else {
					console.log(err.response.data);
				}
			}
		})();

		// initialize WebSocket client
		setClient((_) => {
			const wsClient = new w3cwebsocket(
				"ws://localhost:5000/api/chat/direct/615b4f11fd8bac08c7ff3605"
			);
			wsClient.onopen = () => {
				console.log("Client Connected");
			};
			wsClient.onmessage = (message) => {
				// console.log(message);
				try {
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

	// Send message on 'ENTER' press
	const handleKeypress = (e) => {
		const code = typeof e.which == "number" ? e.which : e.keyCode;
		if (code === 13) {
			sendMessage();
		}
	};

	function onInputChange(event) {
		if (textInput.length < 1000) {
			setTextInput(event.target.value);
		}
	}

	function renderMessages() {
		var prevDate = null;
		return messages.map((message) => {
			if (prevDate !== message.date) {
				prevDate = message.date;
				return (
					<div
						className="flex mt-2 justify-center items-center"
						key={message.date}
					>
						<span className="h-auto text-gray-300 rounded-br-none text-xs rounded-lg p-2">
							{message.date}
						</span>
					</div>
				);
			}
			return (
				<MessageBubble
					message={message}
					fromLoggedIn={message.author.username === auth.username}
					key={message._id}
				/>
			);
		});
	}

	return (
		participant && (
			<div className="h-screen bg-gray-300 overflow-auto">
				<div className="flex justify-center items-center h-screen ">
					<div className="w-5/12 h-100 bg-white rounded shadow-2xl">
						<nav className="w-full h-14 border-b border-gray-200 rounded-tr rounded-tl flex justify-between items-center">
							<div className="flex justify-center items-center p-1">
								<i className="mdi mdi-arrow-left font-normal text-gray-300 ml-1"></i>{" "}
								<img
									src={`/images/${participant.profilePicture}`}
									className="rounded-full ml-2 w-10 h-10"
									alt={participant.username}
								/>
								<span className="text-sm font-medium text-gray-600 ml-2">
									{participant.username}
								</span>
							</div>
						</nav>
						<div
							className="overflow-auto px-1 py-1"
							style={{ height: "19rem" }}
						>
							{renderMessages()}
						</div>

						<div className="flex justify-between items-center px-1 border-t border-gray-200">
							<input
								type="text"
								className="h-8 w-11/12 mx-2 text-xs pl-5 pr-20 bg-gray-100 rounded-lg z-0 focus:shadow focus:outline-none"
								placeholder="Write something..."
								onChange={onInputChange}
								onKeyPress={handleKeypress}
								value={textInput}
							/>
							<div
								className="m-3 h-8 w-8 flex justify-center align-middle bg-purple-500 rounded-full p-1 transform hover:shadow-lg hover:bg-purple-600 cursor-pointer "
								onClick={sendMessage}
							>
								<FiSend
									style={{ color: "white", margin: "auto" }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	);
}
export default DirectChat;
