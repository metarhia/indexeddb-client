import { adoptObjectStore } from "./store";

const adoptTransaction = (tx) => ({
  durability: tx.durability,
  mode: mode,
  objectStoreNames: Array.from(tx.objectStoreNames),
  abort: () => void tx.abort(),
  commit: () => void tx.commit(),
  getObjectStore: (name) => {
    const objectStore = tx.objectStore(name);
    return adoptObjectStore(objectStore);
  }
})

export { adoptTransaction };
