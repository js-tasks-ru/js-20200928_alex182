/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  //es2017
  // return Object.fromEntries(Object.entries(obj).filter(([key]) => fields.includes(key)));
  const resObj = {};
  Object.entries(obj).filter(([key]) => fields.includes(key)).forEach(([key, value]) => resObj[key] = value);
  return resObj;
};
