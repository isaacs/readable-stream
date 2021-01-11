'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
const stream = _readableDenoJs;
{
  // This test ensures that the stream implementation correctly handles values
  // for highWaterMark which exceed the range of signed 32 bit integers and
  // rejects invalid values.
  // This number exceeds the range of 32 bit integer arithmetic but should still
  // be handled correctly.
  const ovfl = Number.MAX_SAFE_INTEGER;
  const readable = stream.Readable({
    highWaterMark: ovfl
  });
  assert.strictEqual(readable._readableState.highWaterMark, ovfl);
  const writable = stream.Writable({
    highWaterMark: ovfl
  });
  assert.strictEqual(writable._writableState.highWaterMark, ovfl);

  for (const invalidHwm of [true, false, '5', {}, -5, NaN]) {
    for (const type of [stream.Readable, stream.Writable]) {
      common.expectsError(() => {
        type({
          highWaterMark: invalidHwm
        });
      }, {
        type: TypeError,
        code: 'ERR_INVALID_OPT_VALUE',
        message: `The value "${invalidHwm}" is invalid for option "highWaterMark"`
      });
    }
  }
}
{
  // This test ensures that the push method's implementation
  // correctly handles the edge case where the highWaterMark and
  // the state.length are both zero
  const readable = stream.Readable({
    highWaterMark: 0
  });

  for (let i = 0; i < 3; i++) {
    const needMoreData = readable.push();
    assert.strictEqual(needMoreData, true);
  }
}
{
  // This test ensures that the read(n) method's implementation
  // correctly handles the edge case where the highWaterMark, state.length
  // and n are all zero
  const readable = stream.Readable({
    highWaterMark: 0
  });
  readable._read = common.mustCall();
  readable.read(0);
}
export default module.exports;