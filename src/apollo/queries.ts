import { gql } from "@apollo/client";

export const GET_PULL_REQUESTS = gql`
  # Type queries into this side of the screen, and you will
  # see intelligent typeaheads aware of the current GraphQL type schema,
  # live syntax, and validation errors highlighted within the text.

  # We'll get you started with a simple query showing your username!
  query ($query: String!) {
    search(type: ISSUE, last: 50, query: $query) {
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
          comments(first: 50, orderBy: { field: UPDATED_AT, direction: DESC }) {
            edges {
              node {
                id
                bodyText
                author {
                  avatarUrl
                  login
                }
                updatedAt
                url
                pullRequest {
                  title
                }
              }
            }
          }
          repository {
            name
          }
          reviewRequests(first: 50) {
            nodes {
              requestedReviewer {
                ... on User {
                  login
                  avatarUrl
                  url
                }
                ... on Team {
                  name
                  avatarUrl
                  url
                }
              }
            }
          }
          reviews(first: 50) {
            nodes {
              comments(first: 10) {
                edges {
                  node {
                    bodyText
                    updatedAt
                    author {
                      login
                      avatarUrl
                    }
                    id
                    pullRequest {
                      title
                      url
                    }
                    url
                  }
                }
              }
              bodyText
              author {
                login
                avatarUrl
              }
              updatedAt
              id
              pullRequest {
                title
              }
              url
            }
          }
        }
      }
    }
    viewer {
      login
    }
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }
`;
