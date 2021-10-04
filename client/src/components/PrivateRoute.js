import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

function PrivateRoute(props) {
	const auth = useSelector((state) => state.auth);

	return auth.token ? props.children : <Redirect to={{ pathname: "/" }} />;
}

export default PrivateRoute;
