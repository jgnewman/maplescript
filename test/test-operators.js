import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Operators', () => {

  it('should compile operators', () => {
    assert.equal(compileCode('(+ 2 3 4)').trim(), '(2 + 3 + 4);');
    assert.equal(compileCode('(- 2 3 4)').trim(), '(2 - 3 - 4);');
    assert.equal(compileCode('(* 2 3 4)').trim(), '(2 * 3 * 4);');
    assert.equal(compileCode('(/ 2 3 4)').trim(), '(2 / 3 / 4);');
    assert.equal(compileCode('(% 2 3 4)').trim(), '(2 % 3 % 4);');
    assert.equal(compileCode('(= 2 3 4)').trim(), '(2 === 3 === 4);');
    assert.equal(compileCode('(!= 2 3 4)').trim(), '(2 !== 3 !== 4);');
  });

});
