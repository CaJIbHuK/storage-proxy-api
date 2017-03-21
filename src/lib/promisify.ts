
export function promisifyErrRes<T>(foo) : Promise<T> {
  return new Promise((res, rej) => foo((error, result) => {
    if (error) return rej(error);
    if (result) return res(result);
  }));
}

export function promisifyResErr<T>(foo) : Promise<T> {
  return new Promise((res, rej) => foo((result, error) => {
    if (error) return rej(error);
    if (result) return res(result);
  }));
}
