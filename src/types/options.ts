export type Repository = {
  isShow: boolean;
  name: string;
};
const repositoryKeys: (keyof Repository)[] = ["isShow", "name"];

export const isRepository = (value: object): value is Repository =>
  repositoryKeys.every((key) => Object.keys(value).includes(key));

export const DELAY_MINUTES: number = 1;

export type NotificationType = "commentNotify";
