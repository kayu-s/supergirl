import { client } from "../apollo";
import { GET_PULL_REQUESTS } from "../apollo/queries";
import { getTargetRepositories } from "../utils";

const subscription = async () => {
  const repositories = await getTargetRepositories();
  client
    .query({
      query: GET_PULL_REQUESTS,
      variables: {
        query: "is:open is:pr review-requested:@me repo:" + repositories,
      },
      fetchPolicy: "no-cache",
    })
    .then((result) => {
      const count = result.data?.search.nodes.length;
      if (count === 0) {
        chrome.action.setBadgeText({ text: "" });
      } else {
        chrome.action.setBadgeText({ text: String(count) });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

subscription();

setInterval(() => {
  subscription();
}, 1000 * 60 * 1);
