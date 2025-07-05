'use strict';

const test = require('node:test');
const assert = require('node:assert');
const indexeddb = require('..');

test('Test: stub', async () => {
  assert.strictEqual(indexeddb, indexeddb);
});
