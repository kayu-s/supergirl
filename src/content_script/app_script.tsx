import React from "react";
import ReactDOM from "react-dom";
import { AppRoot } from "./components/AppRoot";

export const AppScript = () => {
  const body: HTMLElement = document.getElementsByTagName("body")[0]!;
  const reactRootElement = document.createElement("div");
  body.before(reactRootElement);
  ReactDOM.render(<AppRoot />, reactRootElement);
};
