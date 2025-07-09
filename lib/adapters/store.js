import { once } from './event-target';
import { adoptCursor } from "./cursor";
import { adoptIndex } from './index-store';

const adoptObjectStore = (store) => ({
  get: (key) => {
    const request = store.get(key);
    return once(request, 'success');
  },
  getAll: () => {
    const request = store.getAll();
    return once(request, 'success');
  },
  insert: (record) => {
    const request = store.add(record);
    return once(request, 'success');
  },
  delete: (key) => {
    const request = store.delete(key);
    return once(request, 'success');
  },
  update: (record) => {
    const request = store.put(record);
    return once(request, 'success');
  },
  clear: () => {
    const request = store.clear();
    return once(request, 'success');
  },
  count: () => {
    const request = store.count();
    return once(request, 'success');
  },
  getIndex: (name) => {
    const index = store.index(name);
    return adoptIndex(index);
  },
  async *openCursor() {
    const request = store.openCursor();
    let cursor = await once(request, 'success');
    while (cursor.value) {
      yield adoptCursor(cursor);
      cursor = await once(request, "success");
    }
  },
  async *openKeyCursor() {
    const request = store.openKayCursor();
    let cursor = await once(request, 'success');
    while (cursor.key) {
      yield adoptCursor(cursor);
      cursor = await once(request, "success");
    }
  },
})

export { adoptObjectStore };
