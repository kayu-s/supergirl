import { client } from "../apollo";
import { GET_PULL_REQUESTS } from "../apollo/queries";
import { DELAY_MINUTES, NotificationType } from "../types/options";
import { getImageBase64, getTargetRepositories, getUuId } from "../utils";

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
      const nodes = result.data?.search.nodes;

      // Set PR count to badge
      const count = nodes.length;
      if (count === 0) {
        chrome.action.setBadgeText({ text: "" });
      } else {
        chrome.action.setBadgeText({ text: String(count) });
      }

      // Notify comments
      nodes.map((node: any) =>
        node.comments.edges.filter(async (edge: any) => {
          const { updatedAt } = edge.node;
          const date = new Date(updatedAt);
          const progressSecond = (Date.now() - date.getTime()) / 1000;
          if (DELAY_MINUTES * 60 > progressSecond) {
            const {
              bodyText,
              author,
              url: commentUrl,
              pullRequest,
            } = edge.node;
            const { login, avatarUrl } = author;

            const base64AvatarStr = await getImageBase64(avatarUrl);
            chrome.notifications.create(
              `${commentUrl}__commentNotify__${getUuId()}`,
              {
                type: "basic",
                title: `${pullRequest.title}@${node.repository.name}`,
                message: `${login}\r\n${bodyText}`,
                requireInteraction: true,
                silent: false,
                iconUrl: base64AvatarStr,
              }
            );
          }
        })
      );
    })
    .catch((e) => {
      console.log(e);
    });
};

chrome.alarms.create({
  delayInMinutes: DELAY_MINUTES,
  periodInMinutes: DELAY_MINUTES,
});
chrome.alarms.onAlarm.addListener(() => {
  subscription();
});
chrome.notifications.onClicked.addListener((notificationId: string) => {
  const url = notificationId.split("__")[0];
  const notificationType = notificationId.split("__")[1] as NotificationType;
  switch (notificationType) {
    case "commentNotify":
      chrome.tabs.create({ url });
  }
});
