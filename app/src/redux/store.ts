// src/redux/store.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { tempSlice } from "./slices/tempSlice";
import wizardReducer from "./slices/wizardSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["wizard"], // only wizard will be persisted
};

const rootReducer = combineReducers({
  temp: tempSlice.reducer,
  wizard: wizardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
