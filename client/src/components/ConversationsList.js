import React from "react";

function ConversationsList(props) {
	return (
		<div className="md:w-3/12 h-2/3 bg-white rounded-l shadow-2xl">
			<nav className="w-full h-16 border-b border-gray-300 flex justify-between items-center">
				<div className="flex justify-center items-center">
					<img
						src={`/images/${props.auth.profilePicture}`}
						className="rounded-full ml-3 h-8 w-8 sm:w-9 sm:h-9"
						alt={props.auth.username}
					/>
					<span className="text-md font-light text-gray-800 ml-2">
						{props.auth.username}
					</span>
				</div>
			</nav>
			<div className="overflow-auto h-5/6">
				{props.conversations.map((convo) => (
					<div
						className="flex flex-row justify-between cursor-pointer hover:bg-gray-100 hover:shadow-lg"
						key={convo.id}
						data-key={convo.id}
						onClick={(e) => props.clickHandler(convo.id, e)}
					>
						<div className="flex flex-row p-2 justify-start">
							<img
								src={`/images/${convo.profilePicture}`}
								className="rounded-full w-11 h-11 mr-2"
								alt={`${convo.username}`}
							/>
							<div>
								<div className="font-medium text-sm font">
									{convo.username}
								</div>
								<div className="text-xs text-gray-500 truncate">
									{convo.latestMessage &&
										convo.latestMessage.text}
								</div>
							</div>
						</div>
						<div className="text-xs p-3 text-gray-300">
							{convo.latestMessage && convo.latestMessage.time}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default ConversationsList;
