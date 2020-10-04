const defaultComparator = (a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export const sortStrings = ([...arr], param = 'asc') => param === 'asc' ? arr.sort(defaultComparator) : arr.sort((a, b) => defaultComparator(b, a));
