export const isValidURL = (urlString: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-z0-9\\-]+\\.)+[a-z]{2,})|localhost|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ipv4
      "(\\:\\d+)?(\\/[-a-z0-9+&@#/%=~_|$?!:.]*)*$",
    "i"
  );
  return urlPattern.test(urlString);
};
