import { mode } from "../../types/fam";
import { executeClickByTextContent } from "./common";

export const famSignIn = (url: string): void => {
  try {
    if (url.match("/.*signin.*/")) {
      chrome.storage.local.set({ mode: true }, () => {});
      executeClickByTextContent(HTMLButtonElement, "button", "サインイン");
    }
  } catch {
    chrome.storage.local.set({ mode: false }, () => {});
  }
};

export const msSignIn = (): void => {
  try {
    setTimeout(async () => {
      const mailInput: HTMLInputElement = document.querySelector(
        "input[type='email']"
      )!;
      await chrome.storage.sync.get(["fsiMail"], (items) => {
        mailInput.value = "";
        mailInput.value = items.fsiMail;
      });
      await executeClickByTextContent(HTMLInputElement, "input", "次へ");

      const error = await setInterval(async () => {
        await chrome.storage.sync.get(["fsiMail"], (items) => {
          mailInput.value = items.fsiMail;
        });
        if (document.querySelector(".error") === null) clearInterval(error);
        console.log(document.querySelector(".error"));
        await executeClickByTextContent(HTMLInputElement, "input", "次へ");
      }, 1000);

      setTimeout(async () => {
        console.log("password");
        const passwordInput: HTMLInputElement = document.querySelector(
          "input[type='password']"
        )!;
        await chrome.storage.sync.get(["fsiPassword"], (items) => {
          passwordInput.value = items.fsiPassword;
        });
        executeClickByTextContent(HTMLInputElement, "input", "サインイン");
        setTimeout(() => {
          executeClickByTextContent(HTMLInputElement, "input", "はい");
        }, 3000);
      }, 3000);
    }, 3000);
  } catch {
    chrome.storage.local.set({ famSignInMode: "false" }, () => {});
  } finally {
    chrome.storage.local.set({ famSignInMode: "false" }, () => {});
  }
};
