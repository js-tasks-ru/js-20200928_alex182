/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if(!string) return '';
  const arr = [{char: string[0], count: 0}];
  for (let char of string) {
    if (arr[arr.length - 1].char !== char) {
      arr.push({char, count: 1});
    } else {
      arr[arr.length - 1].count++;
    }
  }
  return arr.reduce((acc, {char, count}) => (acc += count > size ? char.repeat(size) : char.repeat(count)), "");
}
