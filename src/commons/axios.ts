import axios from "axios";

export const axiosBase = (token: string) => {
  return axios.create({
    baseURL: "https://api.github.com/",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
