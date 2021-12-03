import React from "react";
import ReactDOM from "react-dom";
import { AppRoot } from "./components/AppRoot";

export const appScript = () => {
  const body: HTMLElement = document.getElementById("root")!;
  const reactRootElement = document.createElement("div");
  body.before(reactRootElement);
  ReactDOM.render(<AppRoot />, reactRootElement);
};

appScript();
