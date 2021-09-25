import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";
// import { createCookieMiddleware } from "redux-cookie";

import authSlice from "./auth-slice";

// const middlewareEnhancer = applyMiddleware(createCookieMiddleware(Cookies));

const store = configureStore({
	reducer: { auth: authSlice.reducer },
	// enhancers: [middlewareEnhancer],
	// middleware: [createCookieMiddleware(Cookies)],
});

export const authActions = authSlice.actions;
export default store;
