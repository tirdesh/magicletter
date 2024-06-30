// src/redux/slices/aiProviderSlice.ts
import { AIProviderName } from "@/model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AIProviderState {
  currentProvider: AIProviderName;
}

const initialState: AIProviderState = {
  currentProvider: "openai",
};

const aiProviderSlice = createSlice({
  name: "aiProvider",
  initialState,
  reducers: {
    setAIProvider: (state, action: PayloadAction<AIProviderName>) => {
      state.currentProvider = action.payload;
    },
  },
});

export const { setAIProvider } = aiProviderSlice.actions;
export default aiProviderSlice.reducer;
