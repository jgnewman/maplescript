import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Symbols', () => {

  it('should compile symbol syntax into a symbol', () => {
    const toCompile = ':sym';
    assert.equal(compileCode(toCompile).trim(), 'Symbol.for("sym");');
  });

});
