import React from "react";

function ConfirmModal(props) {
	return (
		<div
			className={`${
				props.visible ? "flex" : "hidden"
			} bg-black bg-opacity-50 absolute inset-0 justify-center items-center`}
			id="overlay"
		>
			<div className="bg-gray-200 text-center max-w-sm p-9 rounded shadow-xl text-gray-800">
				<div className="flex justify-between items-center p-4">
					<h4 className="text-lg ">{props.text}</h4>
				</div>

				<div className="mt-3 flex justify-center space-x-3">
					<button
						onClick={() => props.onResponse(false)}
						className="cursor-pointer inline-block text-sm px-4 py-3 leading-none border rounded text-white border-purple-500 hover:border-transparent hover:text-white text-purple-500 hover:bg-purple-500 mt-4 lg:mt-0"
					>
						Cancel
					</button>
					<button
						onClick={() => props.onResponse(true)}
						className="cursor-pointer inline-block text-sm px-4 py-3 leading-none border rounded text-white border-green-500 hover:border-transparent hover:text-white text-green-500 hover:bg-green-500 mt-4 lg:mt-0"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmModal;
