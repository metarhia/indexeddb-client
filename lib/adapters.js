import { createAdapter, once, on } from "./utils/index.js";

const adoptCursor = createAdapter({
  delete: [once, 'success'],
  update: [once, 'success'],
});

const adoptIndex = createAdapter({
  get: [once, 'success'],
  getAll: [once, 'success'],
  getAllKeys: [once, 'success'],
  getKey: [once, 'success'],
  count: [once, 'success'],
  openCursor: [on, 'success', adoptCursor],
  openKeyCursor: [on, 'success', adoptCursor],
});

const adoptObjectStore = createAdapter({
  add: [once, 'success'],
  clear: [once, 'success'],
  count: [once, 'success'],
  delete: [once, 'success'],
  get: [once, 'success'],
  getAll: [once, 'success'],
  getAllKeys: [once, 'success'],
  getKey: [once, 'success'],
  put: [once, 'success'],
  openCursor: [on, 'success', adoptCursor],
  openKeyCursor: [on, 'success', adoptCursor],
  creasteIndex: adoptIndex,
  index: adoptIndex,
});

const adoptTransaction = createAdapter({
  objectStoreNames: Array.from,
  objectStore: adoptObjectStore,
});

const adoptDB = createAdapter({
  objectStoreNames: Array.from,
  transaction: adoptTransaction
})

export { adoptDB };