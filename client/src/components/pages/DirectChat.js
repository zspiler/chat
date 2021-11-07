import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { w3cwebsocket } from "websocket";

import { FiX, FiSend } from "react-icons/fi";

import MessageBubble from "../MessageBubble";
import Spinner from "../layout/Spinner";
import ConfirmPopup from "../layout/ConfirmPopup";
import ConversationsList from "../ConversationsList";
import UserSearch from "../UserSearch";
import Error from "../layout/Error";

import { animateScroll } from "react-scroll";

function DirectChat() {
	const latestMessageRef = useRef();

	const auth = useSelector((state) => state.auth);

	// websocket connection
	const [client, setClient] = useState(null);

	const [conversations, setConversations] = useState([]);
	const [messages, setMessages] = useState([]);
	const [participant, setParticipant] = useState(null);
	const [loading, setLoading] = useState(false);

	const [textInput, setTextInput] = useState("");

	// Searching users
	const [userSearchResults, setUserSearchResult] = useState([]);
	const [searchText, setSearchText] = useState("");

	// Create-conversation popup
	const [createConvoPopup, setCreateConvoPopup] = useState(false);
	const [createConvoUser, setCreateConvoUser] = useState(null);

	// Delete-conversation popup
	const [deleteConvoPopup, setDeleteConvoPopup] = useState(false);
	const [deleteConvoId, setDeleteConvoId] = useState(null);

	// Error for popup
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchConversations();
	}, []);

	// Open WebSocket connection for a conversation
	function initWS(conversationId) {
		const baseUrl =
			process.env.REACT_APP_ENV === "production"
				? "178.128.193.133:5000" // TODO: proxy!!!, aaaaa localhost:80!!!
				: "localhost:5000";

		const wsClient = new w3cwebsocket(
			`ws://${baseUrl}/api/chat/direct/${conversationId}`
		);
		wsClient.onmessage = (message) => {
			try {
				const msg = JSON.parse(message.data);
				setMessages((previousState) => [...previousState, msg]);
				scrollToLatestMessage();
			} catch (err) {
				console.log("err");
				setError(err.message);
			}
		};

		setClient(wsClient);
	}

	async function fetchConversations() {
		try {
			const res = await axios.get(`/api/conversations`);
			setConversations(res.data);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		}
	}

	function fetchMessages(conversationId) {
		(async function () {
			setLoading(true);
			try {
				setLoading(true);
				const res = await axios.get(
					`/api/conversations/${conversationId}`
				);
				setLoading(false);
				setMessages(res.data.messages);
				scrollToLatestMessage();
			} catch (err) {
				setLoading(false);
				setError(err.response?.data?.message || err.message);
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

	function scrollToLatestMessage() {
		animateScroll.scrollToBottom({
			containerId: "chatWindow",
			duration: 600,
		});
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
				// display Date
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
				await axios.delete(`/api/conversations/${deleteConvoId}`);
				fetchConversations();
				setParticipant(null);
				setMessages([]);
				setDeleteConvoId(null);
			} catch (err) {
				setError(err.response?.data?.message || err.message);
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
				await axios.post(`/api/conversations`, {
					userId: createConvoUser.id,
				});
				fetchConversations();
				setUserSearchResult([]);
				setSearchText("");
				setCreateConvoUser(null);
			} catch (err) {
				setError(err.response?.data?.message || err.message);
			}
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
						`/api/users/search/?username=${query}`
					);
					setUserSearchResult(res.data);
				} catch (err) {
					setError(err.response?.data?.message || err.message);
				}
			})();
		} else {
			setUserSearchResult([]);
		}
	}

	return (
		<React.Fragment>
			<div className="bg-gray-200 h-screen flex justify-center mb-80 pt-10 sm:pt-0 md:mb-0">
				<div className="flex flex-col md:flex-row justify-center h-screen w-5/6 sm:mt-24">
					<ConversationsList
						auth={auth}
						clickHandler={openConversation}
						conversations={conversations}
					/>

					<div className="flex flex-col mt-8 h-2/3 md:mt-0 md:w-5/12  bg-white shadow-2xl relative">
						<nav
							className={`flex w-full h-16 border-gray-200 justify-between items-center`}
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
						<div
							className="overflow-y-auto px-1 py-1 h-5/6"
							id="chatWindow"
						>
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
							<div className="flex h-16 w-full bg-white justify-between items-center px-1 border-t border-gray-200 rounded-br">
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
					<UserSearch
						searchText={searchText}
						clickHandler={createConversation}
						onInputChange={onSearchInputChange}
						searchResults={userSearchResults}
					/>
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
			{error && <Error error={error} />}
		</React.Fragment>
	);
}
export default DirectChat;
