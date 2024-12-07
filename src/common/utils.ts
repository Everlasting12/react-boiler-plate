export function replaceUrlParams(
  url: string,
  params: { [key: string]: any },
): string {
  return url.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    // Check if the key exists in the params object, otherwise leave it as is
    return params[key];
    //!== undefined ? params[key] : `:${key}`;
  });
}
