
export const filterObject = <T>(data, fields) : T => {
  for(let key of Object.keys(data)) {
    if (fields.indexOf(key) < 0) delete data[key];
  }
  return data;
};