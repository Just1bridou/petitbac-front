import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";
import wsSlice from "./redux/slices/ws";
import userSlice from "./redux/slices/user";
import persistCombineReducers from "redux-persist/es/persistCombineReducers";
import partySlice from "./redux/slices/party";
import serverSlice from "./redux/slices/server";
import miscSlice from "./redux/slices/misc";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistCombineReducers(persistConfig, {
  ws: wsSlice,
  user: userSlice,
  party: partySlice,
  server: serverSlice,
  misc: miscSlice,
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
