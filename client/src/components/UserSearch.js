import React from "react";

function UserSearch(props) {
	return (
		<div className="mt-8 md:mt-0 md:w-3/12 h-2/3 bg-white rounded-r shadow-2xl relative">
			<nav className="w-full h-16 border-b border-gray-200 flex justify-between items-center">
				<input
					className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
					id="search"
					type="text"
					placeholder="Search for users.."
					onChange={props.onInputChange}
					value={props.searchText}
				/>
			</nav>
			<div className="overflow-auto px-1 py-1 h-5/6">
				{props.searchResults.map((user) => (
					<div
						className="flex flex-row bg-gray-100 justify-between cursor-pointer hover:bg-gray-200"
						key={user.id}
						onClick={(e) => props.clickHandler(user, e)}
					>
						<div className="flex flex-row p-2 justify-start">
							<div className="float-left">
								<img
									src={`/images/${user.profilePicture}`}
									className="rounded-full w-11 h-11 mr-2"
									alt={user.profilePicture}
								/>
							</div>
							<div>
								<div className="font-medium text-sm font">
									{user.username}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default UserSearch;
