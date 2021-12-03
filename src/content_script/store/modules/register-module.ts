import { createSlice, PayloadAction as PA } from "@reduxjs/toolkit";

export type CompanyTableState = {
  mode: boolean;
  checkCount: number;
  isAutoInput: boolean;
};

export const initialState: CompanyTableState = {
  mode: false,
  checkCount: 0,
  isAutoInput: localStorage.getItem("isAutoInput") === "true" ? true : false,
};

export const RegisterModule = createSlice({
  name: "register",
  initialState,
  reducers: {
    changeTableMode: (state, { payload: mode }: PA<boolean>) => {
      state.mode = mode;
      console.log(`mode: ${state.mode}`);
    },
    checkRegister: (state, { payload: checkCount }: PA<number>) => {
      state.checkCount = checkCount;
    },
    checkAutoRegister: (state, { payload: isAutoInput }: PA<boolean>) => {
      state.isAutoInput = isAutoInput;
      localStorage.setItem("isAutoInput", isAutoInput ? "true" : "false");
    },
  },
});
