import React from "react";
import axios from "axios";

async function call() {
	// try {
	// 	const res = await axios.post(
	// 		"/api/conversations",
	// 		{
	// 			username: "azra123",
	// 		},
	// 		{
	// 			withCredentials: true,
	// 		}
	// 	);
	// 	console.log("res: ");
	// 	console.log(res);
	// } catch (err) {
	// 	if (err.response.data.message) {
	// 		console.log(err.response.data.message);
	// 	} else {
	// 		console.log(err.response.data);
	// 	}
	// }

	try {
		const res = await axios.put(
			"/api/conversations",
			{
				text: "less goo",
				conversationId: "615b4f11fd1bac08c7ff3605",
			},
			{
				withCredentials: true,
			}
		);
		console.log("res: ");
		console.log(res);
	} catch (err) {
		if (err.response.data.message) {
			console.log(err.response.data.message);
		} else {
			console.log(err.response.data);
		}
	}
}

function Dev() {
	return (
		<div>
			<h1>Dev</h1>

			<button
				className="font-bold py-2 px-4 rounded bg-blue-500 text-white"
				onClick={call}
			>
				button
			</button>
		</div>
	);
}

export default Dev;
