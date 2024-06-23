// redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { tempSlice } from './slices/tempSlice';

const rootReducer = {
  temp: tempSlice.reducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;