import { once } from './event-target.js';

const adoptCursor = (origin) => ({
  value: origin.value,
  direction: origin.direction,
  key: origin.key,
  primaryKey: origin.primaryKey,
  continue() {
    origin.continue();
  },
  advance(count) {
    origin.advance(count);
  },
  delete() {
    const request = origin.delete();
    return once(request, 'success');
  },
  update(value) {
    const request = origin.update(value);
    return once(request, 'success');
  }
});

export { adoptCursor };
