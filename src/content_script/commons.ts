export const getElement = (name: string): HTMLInputElement =>
  <HTMLInputElement>document.getElementsByName(name)[0];
export const paddingZero = (num: number) => {
  return ("0" + num).slice(-2);
};

export const suppressZero = (str: string): string => {
  // if only zero, then return single zero.
  if (!str.match(/[^0]+/g)) return "0";
  return str.replace(/^0+/, "");
};

//Todo: add docstring
export const generateDates = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 2, 0);
};
