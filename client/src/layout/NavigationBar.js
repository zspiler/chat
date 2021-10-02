import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { logoutUser } from "../store/auth-slice";

import classes from "./NavigationBar.module.css";

function NavigationBar() {
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
		<div className={classes.topnav}>
			<NavLink to="/home" activeClassName={classes.active}>
				Home
			</NavLink>
			<NavLink to="/friends" activeClassName={classes.active}>
				Friends
			</NavLink>

			{auth.token && <a>Logged in as: {auth.username}</a>}
			{auth.token ? (
				<a className="text-gray-1000" onClick={logOut}>
					Log Out
				</a>
			) : (
				<React.Fragment>
					<Link to="/login">Login</Link>
					<Link to="/signup">Register</Link>
				</React.Fragment>
			)}
		</div>
	);
}

export default NavigationBar;
