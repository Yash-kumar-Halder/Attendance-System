import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./Slices/User/user";
import themeReducer from "./Slices/User/theme.js";
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
});

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["user", "theme"], // only persist the user slice
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
