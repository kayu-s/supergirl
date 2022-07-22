import { Repository } from "../types/options";

export const getTargetRepositories = async (): Promise<string[]> => {
  const repos = await chrome.storage.sync.get("repositories");
  const targetRepos = repos["repositories"]
    ? repos["repositories"]
        .map((o: Repository) => o.isShow && o.name)
        .join(" repo:")
    : "";
  return targetRepos;
};

/**
 *
 * @param url Image url
 * @returns converted image base64 strings
 */
export const getImageBase64 = async (url: string) => {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");
  const arrayBuffer = await response.arrayBuffer();
  let base64String = btoa(
    String.fromCharCode.apply(null, new Uint8Array(arrayBuffer) as any)
  );
  return `data:${contentType};base64,${base64String}`;
};

/**
 *
 * @param strong
 * @returns
 */
export const getUuId = (strong: number = 1000): string => {
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
};

export const isNotifyTarget = (
  lastUpdatedAt: string,
  duration: number
): boolean => {
  const date = new Date(lastUpdatedAt);
  const progressSecond = (Date.now() - date.getTime()) / 1000;
  return duration * 60 > progressSecond;
};
