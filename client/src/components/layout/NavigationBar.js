import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth-slice";

function NavigationBar() {
	const location = useLocation();
	const history = useHistory();
	const dispatch = useDispatch();

	const auth = useSelector((state) => state.auth);

	function logOut() {
		dispatch(logoutUser())
			.unwrap()
			.then(() => {
				console.log("Successfully logged out");
				history.replace("/");
			})
			.catch(() => {
				console.log("Error logging out");
			});
	}

	return (
		<nav className="flex sticky items-center justify-between flex-wrap bg-purple-500 p-6">
			<Link to="/">
				<div className="flex items-center flex-shrink-0 text-white mr-6">
					<div className="flex items-center mr-2">
						<div className="bg-green-500 h-9 w-3"></div>
						<div className="bg-blue-500 h-6 w-3"></div>
						<div className="bg-red-500 h-3 w-3"></div>
					</div>

					<span className="font-semibold text-xl tracking-tight">
						Chat
					</span>
				</div>
			</Link>
			<div className="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
				<div className="sm:flex-grow">
					{auth.token && (
						<React.Fragment>
							<div
								href="#responsive-header"
								className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white hover:border-b hover:border-gray-300 mr-4"
							>
								<NavLink
									to="/direct"
									activeClassName="active-tab"
								>
									Direct
								</NavLink>
							</div>
							<div
								href="#responsive-header"
								className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white hover:border-b hover:border-gray-300 mr-4"
							>
								<NavLink
									to="/group"
									activeClassName="active-tab"
								>
									Group
								</NavLink>
							</div>
						</React.Fragment>
					)}
				</div>

				<div>
					<div className="flex flex-col sm:flex-row sm:space-x-4">
						{auth.token && (
							<React.Fragment>
								<span className="font-light text-white text-opacity-70 py-2 align-middle">
									Hello, {auth.username}!
								</span>
								<img
									className="hidden sm:block rounded-full my-auto border border-opacity-80 border-solid shadow-sm h-8 w-8"
									src={`/images/${auth.profilePicture}`}
									alt={`${auth.username}`}
								/>
							</React.Fragment>
						)}
						{auth.token && (
							<React.Fragment>
								<button
									className="btn w-1/3 sm:w-auto text-sm leading-none px-4 py-3 text-white border-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 sm:mt-0"
									onClick={logOut}
								>
									Log Out
								</button>
							</React.Fragment>
						)}
						<React.Fragment>
							{!auth.token && location.pathname !== "/login" && (
								<Link to="/login">
									<button className="btn ml-2 text-sm px-4 py-2 text-white border-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 sm:mt-0">
										Login
									</button>
								</Link>
							)}

							{!auth.token && location.pathname !== "/signup" && (
								<Link to="/signup">
									<button className="btn ml-2 text-sm px-4 py-2 text-white border-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 sm:mt-0">
										Sign Up
									</button>
								</Link>
							)}
						</React.Fragment>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default NavigationBar;
