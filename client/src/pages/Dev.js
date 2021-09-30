import React from "react";
import axios from "axios";

async function call() {
	try {
		const res = await axios.post(
			"/api/users/block",
			{
				username: "zanspiler",
			},
			{
				withCredentials: true,
			}
		);
		console.log(res.data);
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

			<button onClick={call}>x</button>
		</div>
	);
}

export default Dev;
