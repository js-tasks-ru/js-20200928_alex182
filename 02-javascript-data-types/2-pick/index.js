/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) =>
  Object.entries(obj)
    .filter(([k]) => fields.includes(k))
    .reduce((acc, [k, v]) => ({...acc, [k]: v}), {});

//es2017 SECOND SOLUTION
// return Object.fromEntries(Object.entries(obj).filter(([key]) => fields.includes(key)));
