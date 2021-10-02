import { Switch, Route, Redirect } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import NavigationBar from "./layout/NavigationBar";
import Dev from "./pages/Dev";

import { getUser } from "./store/auth-slice";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	return (
		// <div className=" from-purple-400 via-indigo-400 to-pink-200 bg-gradient-to-r">
		<React.Fragment>
			<NavigationBar />
			<Switch>
				<Route path="/" exact>
					<Redirect to="/welcome" />
				</Route>
				<Route path="/welcome" exact>
					<Welcome />
				</Route>
				<Route path="/login" exact>
					<Login />
				</Route>
				<Route path="/signup" exact>
					<Signup />
				</Route>
				<Route path="/dev" exact>
					<Dev />
				</Route>
				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</React.Fragment>
		// </div>
	);
}

export default App;
