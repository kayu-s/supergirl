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

export const GET_PULL_REQUESTS = gql`
  # Type queries into this side of the screen, and you will
  # see intelligent typeaheads aware of the current GraphQL type schema,
  # live syntax, and validation errors highlighted within the text.

  # We'll get you started with a simple query showing your username!
  query {
    search(
      type: ISSUE
      last: 100
      query: "is:open is:pr review-requested:@me"
    ) {
      issueCount
      nodes {
        ... on PullRequest {
          title
          url
          createdAt
          author {
            login
            avatarUrl
            url
          }
          comments(first: 100) {
            edges {
              node {
                id
              }
            }
          }
          repository {
            name
          }
          reviewRequests(first: 100) {
            nodes {
              requestedReviewer {
                ... on User {
                  login
                  avatarUrl
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

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
