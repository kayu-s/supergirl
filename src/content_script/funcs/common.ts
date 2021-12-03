export const executeClickByTextContent = (
  elementTarget: any,
  elementName: string,
  label: string
): void => {
  const elements: HTMLCollectionOf<typeof elementTarget> =
    document.getElementsByTagName(elementName);
  for (const element of elements) {
    const text: string = element.textContent || element.value;
    const regExp = new RegExp(".*" + label + ".*", "g");
    if (text.match(regExp)) {
        element.click();
        console.log(1)
    } 
  }
};

export const modeValidator = (modeTarget: string): boolean => {
  chrome.runtime.sendMessage(
    { method: "getItem", key: modeTarget },
    function (response) {
      if (response.data === "true") {
        return true;
      }
    }
  );
  return false;
};
