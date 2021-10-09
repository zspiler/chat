import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { w3cwebsocket } from "websocket";

import { FiSend } from "react-icons/fi";

import MessageBubble from "../MessageBubble";

function DirectChat() {
	const scrollBoxRef = useRef();
	const latestMessageRef = useRef();

	const auth = useSelector((state) => state.auth);

	const [client, setClient] = useState(null);

	const [messages, setMessages] = useState([]);
	const [participant, setParticipant] = useState(null);
	const [loading, setLoading] = useState(false);

	const [textInput, setTextInput] = useState("");

	useEffect(() => {
		// Fetch conversation
		(async function () {
			try {
				setLoading(true);
				const res = await axios.get(
					`/api/conversations/615b4f11fd8bac08c7ff3605`,
					{
						withCredentials: true,
					}
				);
				for (let i = 0; i < res.data.users.length; i++) {
					if (res.data.users[i].username !== auth.username) {
						setParticipant((_) => res.data.users[i]);
						// TODO: do this in API....
						break;
					}
				}
				setLoading(false);
				setMessages(res.data.messages);
			} catch (err) {
				setLoading(false);
				// TODO: error
				console.log(err);
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
				try {
					const msg = JSON.parse(message.data);
					setMessages((previousState) => [...previousState, msg]);
					scrollToLatestMessage();
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

	function scrollToLatestMessage() {
		if (latestMessageRef.current) {
			latestMessageRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "start",
			});
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
				<div ref={latestMessageRef} key={message._id}>
					{scrollToLatestMessage()}
					<MessageBubble
						message={message}
						fromLoggedIn={message.author.username === auth.username}
					/>
				</div>
			);
		});
	}

	return (
		<React.Fragment>
			<div className="h-screen bg-gray-300 overflow-auto">
				<div className="flex justify-center items-center h-screen">
					{loading && (
						<div className="loader bg-black ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
					)}
					{participant && (
						<div
							className="w-5/12 h-100 bg-white rounded shadow-2xl"
							ref={scrollBoxRef}
						>
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
										style={{
											color: "white",
											margin: "auto",
										}}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
}
export default DirectChat;
