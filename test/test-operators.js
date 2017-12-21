import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Operators', () => {

  it('should compile operators', () => {
    const toCompile = '(+ 2 3 4)';
    assert.equal(compileCode(toCompile).trim(), '(2 + 3 + 4);');
  });

});
