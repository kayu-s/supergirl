import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import InputHelperMenu from "./InputHelperMenu";

export function AppRoot() {
  return (
    <Provider store={store}>
      <InputHelperMenu />
    </Provider>
  );
}
