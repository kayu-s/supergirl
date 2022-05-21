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
