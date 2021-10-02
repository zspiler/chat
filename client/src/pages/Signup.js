import React, { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { signupUser } from "../store/auth-slice";

function Signup() {
	const error = useSelector((state) => state.auth.error);
	const loading = useSelector((state) => state.auth.loading);

	const dispatch = useDispatch();
	const history = useHistory();

	const [formValid, setFormValid] = useState(true);

	const [formData, setFormData] = useState({
		username: "",
		password: "",
		passwordConfirm: "",
	});

	const [editedFields, setEditedFields] = useState({
		username: false,
		password: false,
		passwordConfirm: false,
	});

	const [validFields, setValidFields] = useState({
		username: true,
		password: true,
		passwordConfirm: true,
	});

	// profile pic
	const [profilePicture, setProfilePicture] = useState(null);

	const onSubmit = (event) => {
		event.preventDefault();

		if (formValid) {
			const data = new FormData();
			data.set("picture", profilePicture);
			for (const k in formData) {
				data.set(k, formData[k]);
			}

			dispatch(signupUser(data))
				.unwrap()
				.then(() => {
					history.replace("/");
				})
				.catch((err) => {
					console.log("Error signing up");
					console.log(err);
				});
		}
	};

	function validateForm(data) {
		setValidFields({
			username: data.username.trim().length >= 5,
			password: data.password.length >= 6,
			passwordConfirm: data.password === data.passwordConfirm,
		});
		const valid = Object.values(validFields).every((v) => v === true);
		setFormValid(valid);
		return valid;
	}

	function onInputChange(event) {
		setFormData((prevData) => {
			const updatedFormData = {
				...prevData,
				[event.target.name]: event.target.value,
			};
			validateForm(updatedFormData);
			return updatedFormData;
		});
	}

	function onInputBlur(event) {
		validateForm(formData);
		const inputElement = event.currentTarget.name;
		setEditedFields((prevEdited) => {
			return { ...prevEdited, [inputElement]: true };
		});
	}

	return (
		<React.Fragment>
			<p className="text-5xl text-gray-600">Sign up</p>

			<div className="flex items-center justify-center h-screen">
				<form
					className="w-full max-w-sm md:max-w-xl"
					onSubmit={onSubmit}
				>
					<div className="mb-5">
						<label
							className="block text-gray-500 mb-2"
							htmlFor="username"
						>
							Enter username
						</label>
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							id="inline-full-name"
							type="text"
							name="username"
							onBlur={onInputBlur}
							onChange={onInputChange}
						/>
					</div>
					{editedFields.username && !validFields.username && (
						<p className="error">
							Username should be at least 5 characters long
						</p>
					)}
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
							onBlur={onInputBlur}
							onChange={onInputChange}
						/>
					</div>
					{editedFields.password && !validFields.password && (
						<p className="error">
							Password should be at least 6 characters long
						</p>
					)}
					<div className="mb-5">
						<label
							className="block text-gray-500 mb-2"
							htmlFor="password"
						>
							Confirm password
						</label>
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							id="inline-password"
							type="password"
							name="passwordConfirm"
							onBlur={onInputBlur}
							onChange={onInputChange}
						/>
					</div>
					{editedFields.passwordConfirm &&
						!validFields.passwordConfirm && (
							<p className="error">Passwords do not match</p>
						)}

					<div className="flex items-center">
						<div className="w-2/3">
							<label className="block text-gray-500 mb-2">
								Profile picture
							</label>
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
								<div className="space-y-1 text-center">
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
										aria-hidden="true"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<div className="flex text-sm text-gray-600">
										<label
											htmlFor="file-upload"
											className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
										>
											<span>Upload a file</span>
											<input
												id="file-upload"
												type="file"
												className="sr-only"
												name="profilePic"
												onChange={(e) =>
													setProfilePicture(
														e.target.files[0]
													)
												}
											/>
										</label>
										<p className="pl-1">or drag and drop</p>
									</div>
									<p className="text-xs text-gray-500">
										PNG, JPG up to 10MB
									</p>
								</div>
							</div>
						</div>

						<div className="flex justify-center m-6 w-1/3">
							<img
								className="rounded-full border border-gray-100 shadow-sm h-20 w-20"
								src={
									profilePicture
										? URL.createObjectURL(profilePicture)
										: "images/default.png"
								}
								alt="preview"
							/>
						</div>
					</div>

					<div className="flex items-center justify-center mt-5">
						<button
							className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded"
							disabled={!formValid}
							type="submit"
						>
							<div className=" flex justify-center items-center">
								{loading ? (
									<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
								) : (
									<div>Create Account</div>
								)}
							</div>
						</button>
					</div>
				</form>
				{/* {error && <p>ERROR: {error} </p>} */}
			</div>
		</React.Fragment>
	);
}

export default Signup;
