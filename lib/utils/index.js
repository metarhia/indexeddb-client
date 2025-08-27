import { on, once } from './eventTarget.js';

const pipe = (...fns) => async (x) => {
  let res = x;
  for (const fn of fns) {
    res = await fn(res);
  }
  return res;
};

const createAdapter = (schema = {}) => (adaptee) => {
  const schemaEntries = Object.entries(schema);
  if (schemaEntries.length === 0) return adaptee;
  const propertyDescriptors = {};
  for(const [fieldName, wrapperProps] of schemaEntries) {
    if (!adaptee[fieldName]) continue;
    const [wrapper, ...wrapperArgs] = Array.isArray(wrapperProps)
      ? wrapperProps
      : [wrapperProps];
    const value = typeof adaptee[fieldName] === 'function'
      ? (...args) => wrapper(adaptee[fieldName](...args), ...wrapperArgs)
      : wrapper(adaptee[fieldName], ...wrapperArgs);
    propertyDescriptors[fieldName] = {
      value,
      writable: false,
      enumerable: true,
      configurable: false
    }
  }
  return Object.create(adaptee, propertyDescriptors)
}

export { pipe, createAdapter, on, once };