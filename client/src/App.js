import { Switch, Route, Redirect } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import NavigationBar from "./layout/NavigationBar";

import { getUser } from "./store/auth-slice";

function App() {
	console.log("App");

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUser());
		// .unwrap()
		// .then(() => {
		// 	// console.log("");
		// })
		// .catch(() => {
		// 	// console.log("App.js: Failed to get user");
		// });
	}, [dispatch]);

	return (
		<React.Fragment>
			<NavigationBar />
			<Switch>
				<Route path="/" exact>
					<Redirect to="/home" />
				</Route>
				<Route path="/home" exact>
					<Home />
				</Route>
				<Route path="/login" exact>
					<Login />
				</Route>
				<Route path="/signup" exact>
					<Signup />
				</Route>
				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</React.Fragment>
	);
}

export default App;
