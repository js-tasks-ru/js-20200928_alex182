/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const regex = new RegExp(`(.)\\1{${size},}`, "gm");
  let lastInd = 0;
  let match;
  let res = "";
  while (match = regex.exec(string)) {
    res += string.substring(lastInd, match.index + size);
    lastInd = regex.lastIndex;
  }
  return res + string.substring(lastInd);
}
