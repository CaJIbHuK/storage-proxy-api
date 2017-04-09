
export const filterObject = <T>(data, fields) : T => {
  for(let key of Object.keys(data)) {
    if (!(key in fields)) delete data[key];
  }
  return data;
};