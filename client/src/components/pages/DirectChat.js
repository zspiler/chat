import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { w3cwebsocket } from "websocket";

import { FiX, FiSend } from "react-icons/fi";

import MessageBubble from "../MessageBubble";
import Spinner from "../layout/Spinner";
import ConfirmPopup from "../layout/ConfirmPopup";

function DirectChat() {
	const scrollBoxRef = useRef();
	const latestMessageRef = useRef();

	const auth = useSelector((state) => state.auth);

	// websocket connection
	const [client, setClient] = useState(null);

	const [conversations, setConversations] = useState([]);
	const [messages, setMessages] = useState([]);
	const [participant, setParticipant] = useState(null);
	const [loading, setLoading] = useState(false);

	const [textInput, setTextInput] = useState("");

	// User search
	const [userSearchResult, setUserSearchResult] = useState([]);
	const [searchText, setSearchText] = useState("");

	// Create-conversation popup
	const [createConvoPopup, setCreateConvoPopup] = useState(false);
	const [createConvoUser, setCreateConvoUser] = useState(null);

	// Delete-conversation popup
	const [deleteConvoPopup, setDeleteConvoPopup] = useState(false);
	const [deleteConvoId, setDeleteConvoId] = useState(null);

	useEffect(() => {
		fetchConversations();
	}, []);

	// Open WebSocket connection for a conversation
	function initWS(conversationId) {
		const wsClient = new w3cwebsocket(
			`ws://localhost:5000/api/chat/direct/${conversationId}`
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

		setClient(wsClient);
	}

	async function fetchConversations() {
		try {
			const res = await axios.get(`/api/conversations`, {
				withCredentials: true,
			});

			setConversations(res.data);
		} catch (err) {
			// TODO: error
			console.log(err);
		}
	}

	function fetchMessages(conversationId) {
		(async function () {
			setLoading(true);
			try {
				setLoading(true);
				const res = await axios.get(
					`/api/conversations/${conversationId}`,
					{
						withCredentials: true,
					}
				);
				setLoading(false);
				setMessages(res.data.messages);
			} catch (err) {
				setLoading(false);
				// TODO: error
				console.log(err);
			}
		})();
	}

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

	function onSearchInputChange(event) {
		const query = event.target.value;
		setSearchText(event.target.value);
		if (query.length > 0) {
			// Search users
			(async function () {
				try {
					const res = await axios.get(
						`/api/users/search/?username=${query}`,
						{
							withCredentials: true,
						}
					);
					setUserSearchResult(res.data);
				} catch (err) {
					console.log(err);
				}
			})();
		} else {
			setUserSearchResult([]);
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
		if (participant && messages.length === 0)
			return (
				<div className=" w-full h-full z-50 overflow-hidden opacity-75 flex flex-col items-center justify-center">
					<div className="ease-linear rounded-full text-sm text-gray-500 border-gray-200 mb-4">
						Say hi!
					</div>
				</div>
			);
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

	function openConversation(conversationId) {
		const convo = conversations.find((convo) => {
			return convo.id.toString() === conversationId.toString();
		});
		setParticipant({
			username: convo.username,
			profilePicture: convo.profilePicture,
		});
		fetchMessages(conversationId);
		initWS(conversationId);
	}

	// Deleting conversation
	function createConversation(user) {
		setCreateConvoUser(user);
		setCreateConvoPopup(true);
	}

	async function onConvoDeleteResponse(response) {
		setDeleteConvoPopup(false);
		if (response) {
			try {
				await axios.delete(`/api/conversations/${deleteConvoId}`, {
					withCredentials: true,
				});
				fetchConversations();
				setParticipant(null);
				setMessages([]);
				setDeleteConvoId(null);
			} catch (err) {
				// TODO: handle error
				console.log(err);
			}
		}
	}

	// Creating conversation
	function deleteConversation(user) {
		setDeleteConvoId(
			conversations.find((c) => c.username === user.username).id
		);

		setDeleteConvoPopup(true);
	}

	async function onConvoCreateResponse(response) {
		setCreateConvoPopup(false);
		if (response) {
			try {
				await axios.post(
					`/api/conversations`,
					{ userId: createConvoUser.id },
					{ withCredentials: true }
				);
				fetchConversations();
				setUserSearchResult([]);
				setSearchText("");
				setCreateConvoUser(null);
			} catch (err) {
				// TODO: handle error
				console.log(err);
			}
		}
	}
	return (
		<React.Fragment>
			<div className="bg bg-gray-200 h-screen">
				<div className="flex flex-col md:flex-row  justify-center h-screen sm:mt-24">
					{/* CONVERSATIONS */}
					<div className="md:w-3/12 h-2/3 bg-white rounded-l shadow-2xl">
						<nav className="w-full h-16 border-b border-gray-300 flex justify-between items-center">
							<div className="flex justify-center items-center">
								<img
									src={`/images/${auth.profilePicture}`}
									className="rounded-full ml-3 h-8 w-8 sm:w-9 sm:h-9"
									alt={auth.username}
								/>
								<span className="text-md font-light text-gray-800 ml-2">
									{auth.username}
								</span>
							</div>
						</nav>
						<div className="overflow-auto h-5/6">
							{conversations.map((convo) => (
								<div
									className="flex flex-row justify-between cursor-pointer hover:bg-gray-100 hover:shadow-lg"
									key={convo.id}
									data-key={convo.id}
									onClick={(e) =>
										openConversation(convo.id, e)
									}
								>
									<div className="flex flex-row p-2 justify-start">
										<div className="float-left">
											<img
												src={`/images/${convo.profilePicture}`}
												className="rounded-full w-11 h-11 mr-2"
												alt={`${convo.username}`}
											/>
										</div>
										<div>
											<div className="font-medium text-sm font">
												{convo.username}
											</div>
											<div className="text-xs text-gray-700">
												{convo.latestMessage &&
													(convo.latestMessage.text
														.length > 5
														? convo.latestMessage.text.slice(
																0,
																5
														  ) + "..."
														: convo.latestMessage
																.text)}
											</div>
										</div>
									</div>
									<div className="text-xs p-3 text-gray-300">
										{convo.latestMessage &&
											convo.latestMessage.time}
									</div>
								</div>
							))}
						</div>
					</div>
					{/* CHAT */}
					<div
						className="mt-8 md:mt-0 md:w-5/12 h-2/3 bg-white shadow-2xl relative"
						ref={scrollBoxRef}
					>
						<nav
							className={`flex w-full h-16 ${
								participant && "border-b"
							} border-gray-200 justify-between items-center`}
						>
							{participant && (
								<React.Fragment>
									<div className="flex justify-center items-center p-1">
										<img
											src={`/images/${participant.profilePicture}`}
											className="rounded-full ml-3 w-10 h-10 p-1"
											alt={participant.username}
										/>
										<span className="text-sm font-medium text-gray-600 ml-2">
											{participant.username}
										</span>
									</div>
									<div
										className="m-4 cursor-pointer"
										onClick={(e) =>
											deleteConversation(participant, e)
										}
									>
										<FiX />
									</div>
								</React.Fragment>
							)}
						</nav>
						<div className="overflow-auto px-1 py-1 h-5/6">
							{!participant && (
								<div className=" w-full h-full z-50 overflow-hidden opacity-75 flex flex-col items-center justify-center">
									<div className="ease-linear rounded-full text-sm text-gray-500 border-gray-200 mb-4">
										Start chatting!
									</div>
								</div>
							)}
							{loading && <Spinner />}
							{renderMessages()}
						</div>
						{participant && (
							<div className="flex h-16 w-full absolute bottom-0 bg-white justify-between items-center px-1 border-t border-gray-200 rounded-br">
								<input
									type="text"
									className="h-8 w-11/12 mx-2 text-xs pl-5 pr-20 bg-gray-100 rounded-lg z-0 focus:shadow focus:outline-none"
									placeholder="Write something..."
									onChange={onInputChange}
									onKeyPress={handleKeypress}
									value={textInput}
								/>

								<button
									className={`m-3 h-9 w-9 flex justify-center align-middle  rounded-full p-1 transform ${
										textInput.length > 0
											? "shadow-sm hover:shadow-md bg-purple-500 hover:bg-purple-700 cursor-pointer"
											: "bg-gray-400"
									} `}
									onClick={sendMessage}
								>
									<FiSend
										style={{
											color: "white",
											margin: "auto",
										}}
									/>
								</button>
							</div>
						)}
					</div>
					{/* SEARCH USERS */}
					<div
						className="mt-8 md:mt-0 md:w-3/12 h-2/3 bg-white rounded-r shadow-2xl relative"
						ref={scrollBoxRef}
					>
						<nav className="w-full h-16 border-b border-gray-200 flex justify-between items-center">
							<input
								className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
								id="search"
								type="text"
								placeholder="Search for users.."
								onChange={onSearchInputChange}
								value={searchText}
							/>
						</nav>
						<div className="overflow-auto px-1 py-1 h-5/6">
							{userSearchResult.map((user) => (
								<div
									className="flex flex-row bg-gray-100 justify-between cursor-pointer hover:bg-gray-200"
									key={user.id}
									onClick={(e) => createConversation(user, e)}
								>
									<div className="flex flex-row p-2 justify-start">
										<div className="float-left">
											<img
												src={`/images/${user.profilePicture}`}
												className="rounded-full w-11 h-11 mr-2"
												alt={user.profilePicture}
											/>
										</div>
										<div>
											<div className="font-medium text-sm font">
												{user.username}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<ConfirmPopup
				onResponse={onConvoCreateResponse}
				visible={createConvoPopup}
				text={`Create conversation with '${
					createConvoUser ? createConvoUser.username : null
				}'?`}
			/>
			<ConfirmPopup
				onResponse={onConvoDeleteResponse}
				visible={deleteConvoPopup}
				text="Delete conversation? All messages will be lost for both users!"
				danger={true}
			/>
		</React.Fragment>
	);
}
export default DirectChat;
