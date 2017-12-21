import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Conditions', () => {

  it('should compile a condition block', () => {
    const toCompile = `
      (if
        foo bar
        baz quux
        end)
    `;
    const expected = nlToSpace(`(function(){
      if (foo) {
        return bar
      } else if (baz) {
        return quux
      } else {
        return end
      }
    }).call(this);`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
