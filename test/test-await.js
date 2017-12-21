import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Await', () => {

  it('should compile an await expression', () => {
    const toCompile = '(await (foo bar))';
    assert.equal(compileCode(toCompile).trim(), 'await foo(bar);');
  });

});
