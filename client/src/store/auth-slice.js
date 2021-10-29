import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
	try {
		const res = await axios.post("/api/auth/logout");
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
			const res = await axios.post("/api/auth/login", {
				username: formData.username,
				password: formData.password,
			});
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

export const signupUser = createAsyncThunk(
	"user/signupUser",
	async (formData) => {
		try {
			const res = await axios.post("/api/auth/signup", formData, {
				headers: {
					"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
				},
			});
			return res.data;
		} catch (err) {
			if (err.response.data.message) {
				throw new Error(err.response.data.message);
			} else if (err.message) {
				throw new Error(err.message);
			} else {
				throw new Error("Server error");
			}
		}
	}
);

// Validate cookie
export const getUser = createAsyncThunk("user/getUser", async () => {
	try {
		const res = await axios.post("/api/auth/token");
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
		loading: true,
		error: null,
		token: "",
		username: "",
		profilePicture: "",
	},
	extraReducers: {
		[loginUser.pending]: (state) => {
			state.error = null;
			state.loading = true;
		},
		[loginUser.fulfilled]: (state, action) => {
			state.username = action.payload.username;
			state.token = action.payload.token;
			state.profilePicture = action.payload.profilePicture;
			state.loading = false;
		},
		[loginUser.rejected]: (state, action) => {
			state.error = action.error.message;
			state.loading = false;
		},
		[logoutUser.fulfilled]: (state, _) => {
			state.token = "";
			state.username = "";
			state.profilePicture = "";
		},

		[signupUser.pending]: (state) => {
			state.error = null;
			state.loading = true;
		},
		[signupUser.fulfilled]: (state, action) => {
			state.username = action.payload.username;
			state.token = action.payload.token;
			state.profilePicture = action.payload.profilePicture;
			state.loading = false;
		},
		[signupUser.rejected]: (state, action) => {
			state.error = action.error.message;
			state.loading = false;
		},

		[getUser.pending]: (state) => {
			state.loading = true;
		},
		[getUser.rejected]: (state) => {
			state.loading = false;
		},

		[getUser.fulfilled]: (state, action) => {
			state.token = action.payload.token;
			state.username = action.payload.username;
			state.profilePicture = action.payload.profilePicture;
			state.loading = false;
		},
	},
});

export default authSlice;
