const pipe = (...fns) => async (x) => {
  let res = x;
  for (const fn of fns) {
      res = await fn(res);
  }
  return res;
};

export { pipe };