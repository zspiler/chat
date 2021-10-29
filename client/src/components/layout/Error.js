import React from "react";

import classes from "./Error.module.css";

function Error(props) {
	console.log("err!");
	return (
		<div
			className={`${classes.footer} ${classes.dissapear} bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative`}
			role="alert"
		>
			<strong className="font-bold">Error: </strong>
			<span className="block sm:inline">{props.error}</span>
		</div>
	);
}

export default Error;
