import React from "react";
import axios from "axios";

async function call() {
	(async function () {
		try {
			const res = await axios.get(`/api/conversations`, {
				withCredentials: true,
			});
		} catch (err) {
			console.log(err);
		}
	})();
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
