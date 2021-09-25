import React, { useState } from "react";
import axios from "axios";

function Signup() {
	const [formValid, setFormValid] = useState(true);

	const [formData, setFormData] = useState({
		username: "",
		password1: "",
		password2: "",
	});

	const [editedFields, setEditedFields] = useState({
		username: false,
		password: false,
	});

	const [validFields, setValidFields] = useState({
		username: true,
		password1: true,
		password2: true,
	});

	const onSubmit = (event) => {
		event.preventDefault();
		if (validateForm()) {
			console.log("submitted form");
		}
	};

	function validateForm() {
		setValidFields({
			username: formData.username.trim().length >= 5,
			password1: formData.password1.length >= 6,
			password2: formData.password1 === formData.password2,
		});
		const valid = Object.values(validFields).every((v) => v === true);
		setFormValid(valid);
		return valid;
	}

	function onInputChange(event) {
		setFormData((prevData) => {
			return { ...prevData, [event.target.name]: event.target.value };
		});
		validateForm();
	}

	function onInputBlur(event) {
		validateForm();
		const inputElement = event.currentTarget.name;
		setEditedFields((prevEdited) => {
			return { ...prevEdited, [inputElement]: true };
		});
	}

	return (
		<div>
			<h1>Create new account</h1>
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
				{editedFields.password && !validFields.password1 && (
					<p className="error">
						Password should be at least 6 characters long
					</p>
				)}
				<label>Confirm password</label> <br />
				<input
					type="password"
					onBlur={onInputBlur}
					onChange={onInputChange}
				/>{" "}
				<br />
				{!validFields.password2 && (
					<p className="error">Passwords do not match</p>
				)}
				<button disabled={!formValid}>Create account</button>
			</form>
		</div>
	);
}

export default Signup;
