import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TempState {
  loading: boolean;
  value: string | null;
}

const initialState: TempState = {
  loading: true,
  value: null,
};

export const tempSlice = createSlice({
  name: 'Temp',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.value = action.payload;
    },
  },
});

// Export action creators
export const { setValue } = tempSlice.actions;

// Export reducer
export default tempSlice.reducer;
