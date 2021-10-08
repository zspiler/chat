import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../../store/auth-slice";

import Error from "../layout/Error";

function Login() {
	const error = useSelector((state) => state.auth.error);
	const loading = useSelector((state) => state.auth.loading);

	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	function onInputChange(event) {
		setFormData((prevData) => {
			return { ...prevData, [event.target.name]: event.target.value };
		});
	}

	async function onSubmit(event) {
		event.preventDefault();
		if (!(formData.username.length > 0 && formData.password.length > 0)) {
			return;
		}

		dispatch(loginUser(formData))
			.unwrap()
			.then(() => {
				console.log("Dispatched");
			})
			.catch(() => {
				console.log("Error logging in");
			});
	}

	return (
		<React.Fragment>
			<div className="flex items-center justify-center h-screen">
				<form
					className="w-full max-w-sm md:max-w-xl"
					onSubmit={onSubmit}
				>
					<h1 className="text-4xl text-center text-gray-700">
						Log In
					</h1>

					<div className="mb-5">
						<label
							className="block text-gray-500 mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							id="inline-full-name"
							type="text"
							name="username"
							onChange={onInputChange}
						/>
					</div>
					<div className="mb-5">
						<label
							className="block text-gray-500 mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							id="inline-password"
							type="password"
							name="password"
							onChange={onInputChange}
						/>
					</div>

					<div className="flex items-center justify-center">
						<button
							className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded"
							disabled={
								!(
									formData.username.length > 0 &&
									formData.password.length > 0
								) || loading
							}
							type="submit"
						>
							<div className=" flex justify-center items-center">
								{loading ? (
									<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
								) : (
									<div>Log In</div>
								)}
							</div>
						</button>
					</div>
				</form>
			</div>

			{error && <Error error={error} />}
		</React.Fragment>
	);
}

export default Login;
