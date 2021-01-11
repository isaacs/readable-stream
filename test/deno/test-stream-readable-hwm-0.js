'use strict';

import { Readable } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs; // This test ensures that Readable stream will call _read() for streams
// with highWaterMark === 0 upon .read(0) instead of just trying to
// emit 'readable' event.

const assert = _assert;
const r = new Readable({
  // must be called only once upon setting 'readable' listener
  read: common.mustCall(),
  highWaterMark: 0
});
let pushedNull = false; // this will trigger read(0) but must only be called after push(null)
// because the we haven't pushed any data

r.on('readable', common.mustCall(() => {
  assert.strictEqual(r.read(), null);
  assert.strictEqual(pushedNull, true);
}));
r.on('end', common.mustCall());
process.nextTick(() => {
  assert.strictEqual(r.read(), null);
  pushedNull = true;
  r.push(null);
});
export default module.exports;