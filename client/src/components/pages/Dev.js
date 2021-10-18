import React from "react";
// import axios from "axios";

async function call() {
	// CREATE CONVERSATION
	// try {
	// 	const res = await axios.post(
	// 		`/api/conversations`,
	// 		{
	// 			username: "janez123",
	// 		},
	// 		{
	// 			withCredentials: true,
	// 		}
	// 	);
	// 	console.log("nice");
	// } catch (err) {
	// 	console.log(err);
	// }
	// DELETE CONVERSATION
	// (async function () {
	// 	try {
	// 		const res = await axios.delete(
	// 			`/api/conversations/616415f469edca81a73ea2c6`,
	// 			{
	// 				withCredentials: true,
	// 			}
	// 		);
	// 		console.log("RES: ");
	// 		console.log(res);
	// 	} catch (err) {
	// 		console.log(err.response);
	// 	}
	// })();
	// (async function () {
	// 	try {
	// 		const res = await axios.get(`/api/users/search/?username=za`, {
	// 			withCredentials: true,
	// 		});
	// 		console.log("RES: ");
	// 		console.log(res);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// })();
	// (async function () {
	// 	try {
	// 		const res = await axios.get(`/api/conversations`, {
	// 			withCredentials: true,
	// 		});
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// })();
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
