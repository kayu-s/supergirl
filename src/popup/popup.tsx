import React from "react";
import ReactDOM from "react-dom";
import { AppRoot } from "./components/AppRoot";
import { client } from "../apollo";
import { ApolloProvider } from "@apollo/client";

export const appScript = () => {
  const body: HTMLElement = document.getElementById("root")!;
  const reactRootElement = document.createElement("div");
  body.before(reactRootElement);
  ReactDOM.render(
    <ApolloProvider client={client}>
      <AppRoot />
    </ApolloProvider>,
    reactRootElement
  );
};

appScript();
