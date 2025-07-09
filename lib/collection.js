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
      (objectStore) => objectStore.insert(record)
    );
  }

  update(record) {
    this.validate(record);
    return this.createTransaction('readwrite')(
      (objectStore) => objectStore.update(record)
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

  select({ where, limit, offset, order, filter, sort }) {
    return this.createTransaction('readonly')(async (objectStore) => {
      const result = [];
      let skipped = 0;
      for await (const cursor of objectStore.openCursor()) {
        const record = cursor.value;
        const check = ([key, val]) => record[key] === val;
        const match = !where || Object.entries(where).every(check);
        const valid = !filter || filter(record);
        if (match && valid) {
          if (!offset || skipped >= offset) result.push(record);
          else skipped++;
          if (limit && result.length >= limit) break;
        }
        cursor.continue();
      }
      if (sort) result.sort(sort);
      if (order) Collection.#sort(result, order);
      return result;
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

  static #sort(arr, order) {
    if (typeof order !== 'object') return;
    const rule = Object.entries(order)[0];
    if (!Array.isArray(rule)) return;
    const [field, dir = 'asc'] = rule;
    const sign = dir === 'desc' ? -1 : 1;
    arr.sort((a, b) => {
      const x = a[field];
      const y = b[field];
      if (x === y) return 0;
      return x > y ? sign : -sign;
    });
  }
}

export { Collection };
