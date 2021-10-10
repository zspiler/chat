import React from "react";

function Contacts() {
	return (
		<div className="flex flex-col justify-center text-center">
			<div class="my-10">
				<h1 className="text-5xl text-gray-800">Your Contacts</h1>
			</div>
			<div>
				<h1 className="text-5xl text-gray-800">Add contacts</h1>
				<div className="p-8">
					<div className="bg-white flex items-center rounded-full shadow-xl">
						<input
							className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
							id="search"
							type="text"
							placeholder="Search users.."
						/>

						<div className="p-4">
							<button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center">
								icon
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Contacts;
