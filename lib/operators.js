const where = (tx, storeName) => (query) => async (records = []) => {
  const { where, filter } = query;
  const objectStore = tx.getObjectStore(storeName);
  for await (const cursor of objectStore.openCursor()) {
    const record = cursor.value;
    const check = ([key, val]) => record[key] === val;
    const match = !where || Object.entries(where).every(check);
    const valid = !filter || filter(record);
    if (match && valid) {
      records.push(record);
    }
    cursor.continue();
  }
  return records;
}

const order = () => ({ order }) => async (array) => {
  if (typeof order !== 'object') return array;
  const rule = Object.entries(order)[0];
  if (!Array.isArray(rule)) return array;
  const [field, dir = 'asc'] = rule;
  const sign = dir === 'desc' ? -1 : 1;
  array.sort((a, b) => {
    const x = a[field];
    const y = b[field];
    if (x === y) return 0;
    return x > y ? sign : -sign;
  });
  return array
}

const groupBy = () => () => async (array) => array;

const join = () => () => async (array) => array;

const slice = () => ({ limit = 0, offset }) => (array) => 
    limit || offset ? array.slice(offset, limit) : array;

export { where, order, groupBy, join, slice }