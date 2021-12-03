import React from "react";
import ReactDOM from "react-dom";
import { ConfirmationDialog } from "../components/atoms/ConfirmDialog";
import { AppRoot } from "./components/AppRoot";

export const workTimeInput = () => {
  const tableBody: HTMLElement = document.getElementById("APPROVALGRD")!;
  const reactRootElement = document.createElement("div");
  tableBody.before(reactRootElement);
  ReactDOM.render(<AppRoot />, reactRootElement);
};

export const approveConfirmation = (event: string) => {
  const tableBody: HTMLElement = document.getElementById("APPROVALGRD")!;
  const reactRootElement = document.createElement("div");
  tableBody.before(reactRootElement);
  ReactDOM.render(
    <ConfirmationDialog
      id="ringtone-menu"
      keepMounted
      isOpen={true}
      value={event}
    />,
    reactRootElement
  );
};
