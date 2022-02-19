import React from "react";
import ReactDOM from "react-dom";
import { AppRoot } from "./components/AppRoot";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const result = await chrome.storage.local.get("token");
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${result["token"]}`,
    },
  };
  // return the headers to the context so httpLink can read them
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

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
