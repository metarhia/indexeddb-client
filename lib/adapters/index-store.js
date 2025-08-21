import { once, on } from './event-target';
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
  openCursor() {
    const request = index.openCursor();
    return on(request, 'success');
  },
  async *openKeyCursor() {
    const request = index.openKayCursor();
    return on(request, 'success');
  },
})

export { adoptIndex };
