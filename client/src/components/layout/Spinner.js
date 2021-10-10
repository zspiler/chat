import React from "react";

function Spinner() {
	return (
		<div className=" w-full h-full z-50 overflow-hidden opacity-75 flex flex-col items-center justify-center">
			<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
		</div>
	);
}
export default Spinner;
