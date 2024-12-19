import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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

export function extractVariablesFromUrls(
  urls: string[],
): { key: string; value: string }[] {
  const variableSet = new Set<string>(); // Use a Set to avoid duplicates

  // Regex to match variables in the format {{<variable_name>}}
  const variableRegex = /{{(.*?)}}/g;

  // Iterate over each URL to extract variables
  urls.forEach((url) => {
    let match;
    while ((match = variableRegex.exec(url)) !== null) {
      variableSet.add(match[1]); // Add the variable name to the Set
    }
  });

  // Convert Set to array of objects with key-value pairs
  return Array.from(variableSet).map((variable) => ({
    key: variable,
    value: '',
  }));
}
