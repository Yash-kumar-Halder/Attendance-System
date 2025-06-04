import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./Slices/User/user";
import themeReducer from "./Slices/User/theme.js";
import sidebarReducer from "./Slices/Application/sidebar.js";
import subjectReducer from "./Slices/Application/subjects.js";

import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
	user: userReducer,
	theme: themeReducer,
	sidebar: sidebarReducer,
	subject: subjectReducer,
});

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["user", "theme", "sidebar", "subject"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

export const persistor = persistStore(store);
