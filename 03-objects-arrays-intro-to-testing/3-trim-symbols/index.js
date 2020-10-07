/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) {
    return "";
  }
  const regex = new RegExp(`(.)\\1{${size},}`, "gm");
  const occurenced = string.match(regex);
  return !occurenced ? string : occurenced.reduce((acc, curr) => acc.replace(curr, curr.substring(0, size)), string);
}
