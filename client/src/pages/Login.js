import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { loginUser } from "../store/auth-slice";

function Login() {
	const error = useSelector((state) => state.auth.error);
	const loading = useSelector((state) => state.auth.loading);

	const history = useHistory();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	// TODO: v Login se state reseta na initial, v 'friends' pa ne?

	function onInputChange(event) {
		setFormData((prevData) => {
			return { ...prevData, [event.target.name]: event.target.value };
		});
	}

	async function custom() {
		try {
			const res = await axios.post("/api/auth/protected", {
				withCredentials: true,
			});
			console.log(res);
		} catch (err) {
			console.log(err);
		}
	}

	async function onSubmit(event) {
		event.preventDefault();
		if (!(formData.username.length > 0 && formData.password.length > 0)) {
			return;
		}

		dispatch(loginUser(formData))
			.unwrap()
			.then(() => {
				history.replace("/");
			})
			.catch(() => {
				console.log("Error logging in");
			});
	}

	return (
		<div>
			<h1>Log in</h1>
			<form onSubmit={onSubmit}>
				<label>Username</label> <br />
				<input
					name="username"
					type="text"
					onChange={onInputChange}
				/>{" "}
				<br />
				<label>Password</label> <br />
				<input
					name="password"
					type="password"
					onChange={onInputChange}
				/>
				<br />
				<button
					disabled={
						!(
							formData.username.length > 0 &&
							formData.password.length > 0
						)
					}
				>
					Log In
				</button>
				<br />
				<br />
				<br />
				<br />
			</form>
			<button onClick={custom}>Custom</button>
			{loading && <p>Loading!</p>}
			{error && <h4>ERROR: {error} </h4>}
		</div>
	);
}

export default Login;
