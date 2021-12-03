import { createSlice, PayloadAction as PA } from "@reduxjs/toolkit";

export type theme = {
  darkMode: boolean
};

export const initialState: theme = {
  darkMode: localStorage.getItem("theme") === "light" ? false : true
};

export const OptionsModule = createSlice({
  name: "option",
  initialState,
  reducers: {
    changeTheme: (state, { payload: darkMode }: PA<boolean>) => {
      state.darkMode = darkMode;
      localStorage.setItem("theme", darkMode ? "dark" : "light")
    },
  },
});
