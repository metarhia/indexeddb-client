import { once } from './event-target';
import { adoptCursor } from "./cursor";

const adoptIndex = (index) => ({
  keyPah: index.keyPah,
  multiEntry: index.multiEntry,
  name: index.name,
  unique: index.unique,
  get: (key) => {
    const request = index.get(key);
    return once(request, 'success');
  },
  getAll: () => {
    const request = index.getAll();
    return once(request, 'success');
  },
  count: () => {
    const request = index.count();
    return once(request, 'success');
  },
  async *openCursor() {
    const request = index.openCursor();
    let cursor = await once(request, 'success');
    while (cursor.value) {
      yield adoptCursor(cursor);
      cursor = await once(request, "success");
    }
  },
  async *openKeyCursor() {
    const request = index.openKayCursor();
    let cursor = await once(request, 'success');
    while (cursor.key) {
      yield adoptCursor(cursor);
      cursor = await once(request, "success");
    }
  },
})

export { adoptIndex };
