import React from "react";

function MessageBubble(props) {
	// console.log("PROPS");
	// console.log(props);

	if (props.fromLoggedIn) {
		return (
			<div className={`flex mt-2 justify-end items-end`}>
				<span className="flex bg-purple-500 h-auto text-gray-200 rounded-br-none text-xs rounded-lg p-2 items-end justify-end">
					{props.message.text}
					<span
						className="text-gray-300 pl-1"
						style={{ fontSize: "8px" }}
					>
						{JSON.stringify(props.message.time)}
					</span>
				</span>
				<img
					src={`/images/${props.message.author.profilePicture}`}
					className="rounded-full shadow-xl h-5 w-5 ml-2"
					alt={props.message.author.username}
				/>
			</div>
		);
	}

	return (
		<div className="flex mt-2 items-center ">
			<img
				src={`/images/${props.message.author.profilePicture}`}
				className="rounded-full shadow-xl w-5 h-5 mr-2"
				alt={props.message.author.username}
			/>
			<span className="flex h-auto bg-gray-300 text-gray-800 font-normal rounded-lg text-xs rounded-bl-none p-2 items-end">
				{props.message.text}
				<span
					className="text-gray-500 pl-1"
					style={{ fontSize: "8px" }}
				>
					{JSON.stringify(props.message.time)}
				</span>
			</span>
		</div>
	);
}

export default MessageBubble;
