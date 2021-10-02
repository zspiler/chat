import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/auth-slice";

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
		<nav className="flex items-center justify-between flex-wrap bg-purple-500 p-6">
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
			<div className="block lg:hidden">
				<button className="flex items-center px-3 py-2 border rounded text-purple-200 border-purple-400 hover:text-white hover:border-white">
					<svg
						className="fill-current h-3 w-3"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
					</svg>
				</button>
			</div>
			<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
				<div className="lg:flex-grow">
					{auth.token && (
						<React.Fragment>
							<div
								href="#responsive-header"
								className="block mt-4 lg:inline-block lg:mt-0 text-purple-200 hover:text-white mr-4"
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
								className="block mt-4 lg:inline-block lg:mt-0 text-purple-200 hover:text-white mr-4"
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
					<div className="flex space-x-4">
						{auth.token && (
							<React.Fragment>
								<span className="text-white py-2 align-middle">
									Hello, {auth.username}!
								</span>
								<img
									className="inline-block rounded-full border border-gray-100 shadow-sm h-8 w-8"
									src={`/images/${auth.profilePicture}`}
									alt={`${auth.username}`}
								/>
							</React.Fragment>
						)}
						{auth.token && (
							<div
								className="cursor-pointer inline-block text-sm px-4 py-3 leading-none border rounded text-white border-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 lg:mt-0"
								onClick={logOut}
							>
								Log Out
							</div>
						)}
						<React.Fragment>
							{!auth.token && location.pathname !== "/login" && (
								<Link to="/login">
									<div className="inline-block ml-2 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 lg:mt-0">
										Login
									</div>
								</Link>
							)}

							{!auth.token && location.pathname !== "/signup" && (
								<Link to="/signup">
									<div className="inline-block ml-2 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 lg:mt-0">
										Sign Up
									</div>
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
