import { client } from "../apollo";
import { GET_PULL_REQUESTS } from "../apollo/queries";
import { DELAY_MINUTES, NotificationType } from "../types/options";
import {
  getImageBase64,
  getTargetRepositories,
  getUuId,
  isNotifyTarget,
} from "../utils";

type CommentType = "normal" | "single" | "review";

const sendCommentNotify = async (
  node: any,
  commentNode: any,
  type: CommentType
) => {
  const { updatedAt } = commentNode;
  if (!isNotifyTarget(updatedAt, DELAY_MINUTES)) return;
  const { bodyText, author, url: commentUrl, pullRequest } = commentNode;
  if (bodyText === "") return;
  const { login, avatarUrl } = author;

  const base64AvatarStr = await getImageBase64(avatarUrl);
  await chrome.notifications.create(
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
};

export const subscription = async () => {
  const repositories = await getTargetRepositories();
  client
    .query({
      query: GET_PULL_REQUESTS,
      variables: {
        query: "is:open is:pr repo:" + repositories,
      },
      fetchPolicy: "no-cache",
    })
    .then(async (result) => {
      const { viewer, search } = result.data;
      const { nodes } = search;
      const authorizedUser = viewer.login;

      // Set PR count to badge
      let count = 0;
      for (let searchNode of nodes) {
        for (let reviewRequestsNode of searchNode.reviewRequests.nodes) {
          if (reviewRequestsNode.requestedReviewer.login === authorizedUser) {
            count++;
          }
        }
      }
      if (count == 0) {
        chrome.action.setBadgeText({ text: "" });
      } else {
        chrome.action.setBadgeText({ text: String(count) });
      }

      const items = await chrome.storage.sync.get("notifications");
      if (items.notifications?.comment === false) return;

      // Notify comments
      nodes.map((node: any) => {
        if (!node.reviews?.nodes) return;
        node.reviews.nodes.filter(async (reviewsNode: any) => {
          if (!reviewsNode) return;
          sendCommentNotify(node, reviewsNode, "review");
          if (!reviewsNode.comments.edges[0]?.node) return;
          sendCommentNotify(node, reviewsNode.comments.edges[0].node, "single");
        });
        if (node.comments.edges.length === 0) return;
        node.comments.edges.filter(async (edge: any) => {
          sendCommentNotify(node, edge.node, "normal");
        });
      });
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
