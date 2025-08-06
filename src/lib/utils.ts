export const titleCase = (str: string) =>
  str.replace(/-/g, " ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
