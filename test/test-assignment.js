import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Basic Assignment', () => {

  it('should compile a basic variable assignment', () => {
    const toCompile = '(make foo 4)';
    assert.equal(compileCode(toCompile).trim(), 'const foo = 4;');
  });

});
