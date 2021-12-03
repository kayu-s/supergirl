import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import AppRoot from "./components/AppRoot";
import { store } from "./store/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRoot />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
