import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Objects', () => {

  it('should compile an empty object', () => {
    const toCompile = '{}';
    assert.equal(shrink(compileCode(toCompile)), toCompile + ';');
  });

  it('should compile a populated item object', () => {
    const toCompile = '{:a 1 :b 2}';
    assert.equal(shrink(compileCode(toCompile)), '{[Symbol.for("a")]:1,[Symbol.for("b")]:2};');
  });

});
