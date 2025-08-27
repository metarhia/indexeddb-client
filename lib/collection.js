import { where, order, groupBy, join, slice } from './operators.js';
import { pipe } from  './utils/index.js'

class Collection {
  #name = '';
  #db = null;
  #schema = this.#schema;

  constructor(name, db, schema) {
    this.#name = name;
    this.#db = db;
    this.#schema = schema;
  }

  createTransaction(mode) {
    const txFn = this.#db.createTransaction(this.#name, mode)
    return (exec) => txFn((tx) => {
      const store = tx.getObjectStore(this.#name);
      return exec(store, tx)
    });
  }

  insert(record) {
    this.validate(record);
    return this.createTransaction('readwrite')(
      (objectStore) => objectStore.add(record)
    );
  }

  update(record) {
    this.validate(record);
    return this.createTransaction('readwrite')(
      (objectStore) => objectStore.put(record)
    );
  }

  delete(id) {
    return this.createTransaction('readwrite')(
      (objectStore) => objectStore.delete(id)
    );
  }

  get(id) {
    return this.createTransaction('readonly')(
      (objectStore) => objectStore.get(id)
    );
  }

  getAll() {
    return this.createTransaction('readonly')(
      (objectStore) => objectStore.getAll()
    );
  }

  select(query) {
    return this.#db.createTransaction(this.#name, 'readonly')((tx) => {
      const result = [];
      return pipe(
        where(tx, this.name)(query),
        order(tx, this.name)(query),
        groupBy(tx, this.name)(query),
        join(tx, this.name)(query),
        slice(tx, this.name)(query)
      )(result);
    });
  }

  validate(record) {
    if (!this.#schema) throw new Error(`Schema for ${this.#name} is not defined`);
    for (const [key, val] of Object.entries(record)) {
      const field = this.#schema[key];
      const name = `Field ${store}.${key}`;
      if (!field) throw new Error(`${name} is not defined`);
      if (field.type === 'int') {
        if (Number.isInteger(val)) continue;
        throw new Error(`${name} expected to be integer`);
      } else if (field.type === 'str') {
        if (typeof val === 'string') continue;
        throw new Error(`${name} expected to be string`);
      }
    }
  }

  
}

export { Collection };
