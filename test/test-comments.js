import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Comments', () => {

  it('should ignore comments', () => {
    const toCompile = '-- this is a comment';
    const expected = '';
    assert.equal(compileCode(toCompile), expected);
  });

});
