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

	const [conversations, setConversations] = useState([]);
	const [messages, setMessages] = useState([]);
	const [participant, setParticipant] = useState(null);
	const [loading, setLoading] = useState(false);

	const [textInput, setTextInput] = useState("");

	useEffect(() => {
		// Fetch conversations
		(async function () {
			try {
				const res = await axios.get(`/api/conversations`, {
					withCredentials: true,
				});
				setConversations(res.data);

				// res.data.forEach((conversation) => {
				// 	console.log("convo: ");
				// 	console.log(conversation);
				// 	setConversations((previousState) => [
				// 		...previousState,
				// 		conversation,
				// 	]);
				// });

				// console.log("convos: ");
				// console.log(conversations);
				// setLoading(false);
			} catch (err) {
				// TODO: error
				console.log(err);
			}
		})();

		// Fetch conversation
		(async function () {
			try {
				setLoading(true);
				const res = await axios.get(
					`/api/conversations/6161d48eee76e50e2215e3b5`,
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
				"ws://localhost:5000/api/chat/direct/6161d48eee76e50e2215e3b5"
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
					<React.Fragment key={message.date}>
						<div
							className="flex mt-2 justify-center items-center"
							key={message.date}
						>
							<span className="h-auto text-gray-300 rounded-br-none text-xs rounded-lg p-2">
								{message.date}
							</span>
						</div>
						<div ref={latestMessageRef} key={message._id}>
							{scrollToLatestMessage()}
							<MessageBubble
								message={message}
								fromLoggedIn={
									message.author.username === auth.username
								}
							/>
						</div>
					</React.Fragment>
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
			<div className="bg bg-gray-200 h-screen">
				<div className="flex justify-center h-screen mt-24">
					{/* CONVERSATIONS */}
					<div className="w-2/12 h-2/3 h-80 bg-white rounded-l shadow-2xl">
						<nav className="w-full h-14 border-b border-gray-300 flex justify-between items-center">
							<div className="flex justify-center items-center p-1">
								<img
									src={`/images/${auth.profilePicture}`}
									className="rounded-full ml-2 w-12 h-12"
									alt={auth.username}
								/>
								<span className="text-md text-gray-800 ml-2">
									{auth.username}
								</span>
							</div>
						</nav>
						<div className="overflow-auto h-5/6">
							{conversations.map((convo) => (
								<div
									className="flex flex-row justify-between"
									key={convo.id}
								>
									<div className="flex flex-row p-2 justify-start">
										<div className="float-left">
											<img
												src={`/images/${convo.profilePicture}`}
												className="rounded-full w-11 h-11 mr-2"
												alt="joze"
											/>
										</div>
										<div>
											<div className="font-medium text-sm font">
												{convo.username}
											</div>
											<div className="text-xs text-gray-700">
												{convo.latestMessage.text}
											</div>
										</div>
									</div>
									<div className="text-xs p-3 text-gray-300">
										{convo.latestMessage.time}
									</div>
								</div>
							))}
							{/* {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1].map(
								(_) => (
									<div className="flex flex-row justify-between">
										<div className="flex flex-row p-2 justify-start">
											<div className="float-left">
												<img
													src={`/images/default.png`}
													className="rounded-full w-11 h-11 mr-2"
													alt="joze"
												/>
											</div>
											<div>
												<div className="font-medium text-sm font">
													Janez123
												</div>
												<div className="text-xs text-gray-700">
													Text fake..
												</div>
											</div>
										</div>

										<div className="text-xs p-3 text-gray-300">
											01:05AM
										</div>
									</div>
								)
							)} */}
						</div>
					</div>
					{/* CHAT */}
					{participant && (
						<div
							className="w-5/12 h-2/3 bg-white rounded-r shadow-2xl relative"
							ref={scrollBoxRef}
						>
							<nav className="w-full h-14 border-b border-gray-200 flex justify-between items-center">
								<div className="flex justify-center items-center p-1">
									<img
										src={`/images/${participant.profilePicture}`}
										className="rounded-full ml-3 w-10 h-10"
										alt={participant.username}
									/>
									<span className="text-sm font-medium text-gray-600 ml-2">
										{participant.username}
									</span>
								</div>
							</nav>
							<div className="overflow-auto px-1 py-1 h-5/6">
								{renderMessages()}
							</div>

							<div className="flex h-12 w-full absolute bottom-0 bg-white justify-between items-center px-1 border-t border-gray-200 rounded-br">
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
