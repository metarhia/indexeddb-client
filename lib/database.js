import { adoptTransaction } from "./adapters/transaction.js";
import { once } from "./adapters/event-target.js";
import { Collection } from "./collection.js";

class Database {
  #name;
  #version;
  #schemas;
  #instance = null;
  #collections = {};
  #active = false;

  constructor(name, { version = 1, schemas = {} } = {}) {
    this.#name = name;
    this.#version = version;
    this.#schemas = schemas;
    return this.#open();
  }

  async #open() {
    try {
      const request = indexedDB.open(this.#name, this.#version);
      request.onupgradeneeded = (event) => this.#upgrade(event.target.result);
      this.#instance = await once(request, 'success');
      this.#active = true;
      for (const [name, schema] of Object.entries(this.#schemas)) {
        this.#collections[name] = new Collection(name, this, schema);
      }
      return this;
    } catch(error) {
      throw new Error(`IndexedDB: can't open ${this.#name}`, { cuase: error });
    }
  }

  #upgrade(db) {
    for (const [name, schema] of Object.entries(this.#schemas)) {
      if (!db.objectStoreNames.contains(name)) {
        const options = { keyPath: 'id', autoIncrement: true };
        const store = db.createObjectStore(name, options);
        for (const [field, def] of Object.entries(schema)) {
          if (name !== 'id' && def.index) {
            store.createIndex(field, field, { unique: false });
          }
        }
      }
    }
  }

  getCollection(name) {
    if (!this.#collections[name]) {
      throw Error(`Collection "${name}" doesn't exist`)
    }
    this.#collections[name];
  }

  createTransaction(stores, mode = 'readwrite') {
    if (!this.#active) {
      throw new Error('Database not connected');
    }
    return async (exec) => {
      const originTx = this.#instance.transaction(stores, mode);
      const tx = adoptTransaction(originTx)
      const result = await exec(tx);
      await Promise.race([
        once(originTx, 'complete'),
        once(originTx, 'abort')
      ])
      return result
    }
  }
}

export { Database };
