import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
// import cookies from "js-cookie";

import cook_easy from "react-easy-cookie";

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
	try {
		const res = await axios.post("/api/auth/logout", {
			withCredentials: true,
		});
		return res.data;
	} catch (err) {
		if (err.response.data.message) {
			throw new Error(err.response.data.message);
		} else {
			throw new Error("Server error");
		}
	}
});

export const loginUser = createAsyncThunk(
	"user/loginUser",
	async (formData) => {
		// payload creator
		try {
			const res = await axios.post(
				"/api/auth/login",
				{
					username: formData.username,
					password: formData.password,
				},
				{ withCredentials: true }
			);
			return res.data;
		} catch (err) {
			if (err.response.data.message) {
				throw new Error(err.response.data.message);
			} else {
				throw new Error("Server error");
			}
		}
	}
);

// TODO: setTimeout to log user (clear cookie) out when cookie invalid
// TODO:

export const getUser = createAsyncThunk("user/getUser", async () => {
	try {
		const res = await axios.post("/api/auth/token", {
			withCredentials: true,
		});
		return res.data;
	} catch (err) {
		if (err.response.data.message) {
			throw new Error(err.response.data.message);
		} else {
			throw new Error("Server error");
		}
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState: {
		loading: false,
		error: null,
		token: "",
		username: "",
	},
	reducers: {
		// setLoading(state, action) {
		// 	state.loading = action.payload;
		// },
		// logIn(state, action) {
		// 	state.token = action.payload.token;
		// 	state.username = action.payload.username;
		// },
		// logOut(state) {
		// 	state.token = "";
		// 	state.username = "";
		// },
	},
	extraReducers: {
		[loginUser.pending]: (state) => {
			state.error = null;
			state.loading = true;
		},
		[loginUser.fulfilled]: (state, action) => {
			state.username = action.payload.username;
			state.token = action.payload.token;
			state.loading = false;
		},
		[loginUser.rejected]: (state, action) => {
			state.error = action.error.message;
			state.loading = false;
		},

		[logoutUser.fulfilled]: (state, action) => {
			state.token = "";
			state.username = "";
		},

		[getUser.fulfilled]: (state, action) => {
			state.token = action.payload.token;
			state.username = action.payload.username;
		},
	},
});

export default authSlice;
