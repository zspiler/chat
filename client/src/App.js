import { Switch, Route, Redirect } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Welcome from "./components/pages/Welcome";
import NotFound from "./components/pages/NotFound";
import NavigationBar from "./components/layout/NavigationBar";
import DirectChat from "./components/pages/DirectChat";
import GroupChat from "./components/pages/GroupChat";
import PrivateRoute from "./components/PrivateRoute";
import Dev from "./components/pages/Dev";

import { getUser } from "./store/auth-slice";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	const auth = useSelector((state) => state.auth);

	return (
		<div className="flex flex-col h-screen">
			<NavigationBar />
			<Switch>
				<Route path="/" exact>
					<Redirect to="/welcome" />
				</Route>
				<Route path="/welcome" exact>
					{auth.token && <Redirect to="/direct" />}
					{!auth.token && <Welcome />}
				</Route>
				<Route path="/login" exact>
					{!auth.token && <Login />}
					{auth.token && <Redirect to="/welcome" />}
				</Route>
				<Route path="/signup" exact>
					{!auth.token && <Signup />}
					{auth.token && <Redirect to="/welcome" />}
				</Route>
				<Route path="/dev" exact>
					<Dev />
				</Route>
				<PrivateRoute path="/direct" exact={true}>
					<DirectChat />
				</PrivateRoute>
				<PrivateRoute path="/group" exact={true}>
					<GroupChat />
				</PrivateRoute>
				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</div>
	);
}

export default App;
