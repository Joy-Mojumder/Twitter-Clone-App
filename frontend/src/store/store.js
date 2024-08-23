import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "something",
};

const pathSlice = createSlice({
  name: "path",
  initialState,
  reducers: {
    setPath: (state, action) => {
      state.value = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    path: pathSlice.reducer,
  },
});

export const { setPath } = pathSlice.actions;

export default store;
