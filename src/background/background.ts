import { client } from "../apollo";
import { GET_PULL_REQUESTS } from "../apollo/queries";
import { getTargetRepositories } from "../utils";

const repositories = await getTargetRepositories();

const subscription = () => {
  client
    .query({
      query: GET_PULL_REQUESTS,
      variables: {
        query: "is:open is:pr review-requested:@me repo:" + repositories,
      },
    })
    .then((result) => {
      console.log("result", result);
      const count = result.data?.search.nodes.length;
      if (count === 0) {
        chrome.action.setBadgeText({ text: "" });
        return;
      }
      chrome.action.setBadgeText({ text: String(count) });
    })
    .catch((e) => {
      console.log(e);
    });
};

subscription();

setInterval(() => {
  subscription();
}, 1000 * 60 * 5);
