import React, { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";

import { signupUser } from "../store/auth-slice";

function Signup() {
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
		<div>
			<h1>Create new account</h1>
			{/* <form onSubmit={onSubmit} encType="multipart/form-data"> */}
			<form onSubmit={onSubmit}>
				<label>Enter username</label> <br />
				<input
					name="username"
					type="text"
					onBlur={onInputBlur}
					onChange={onInputChange}
				/>{" "}
				<br />
				{editedFields.username && !validFields.username && (
					<p className="error">
						Username should be at least 5 characters long
					</p>
				)}
				<label>Enter password</label> <br />
				<input
					name="password"
					type="password"
					onBlur={onInputBlur}
					onChange={onInputChange}
				/>{" "}
				<br />
				{editedFields.password && !validFields.password && (
					<p className="error">
						Password should be at least 6 characters long
					</p>
				)}
				<label>Confirm password</label> <br />
				<input
					name="passwordConfirm"
					type="password"
					onBlur={onInputBlur}
					onChange={onInputChange}
				/>{" "}
				<br />
				<label>Profile picture</label> <br />
				{/* TODO: check that < 10MB and png / jpeg  */}
				<input
					type="file"
					name="profilePic"
					// value={profilePicture}
					onChange={(e) => setProfilePicture(e.target.files[0])}
				/>
				{editedFields.passwordConfirm &&
					!validFields.passwordConfirm && (
						<p className="error">Passwords do not match</p>
					)}
				<button disabled={!formValid}>Create account</button>
			</form>
		</div>
	);
}

export default Signup;
