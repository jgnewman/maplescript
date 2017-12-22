import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Destructure', () => {

  it('should destructure with an array ', () => {
    const toCompile = '(destr somevar [:foo bar])';
    const expected = nlToSpace(`
      const foo = somevar[Symbol.for("foo")];
      const bar = somevar["bar"];
    `.trim());
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should destructure with an object ', () => {
    const toCompile = '(destr somevar {:foo bar baz quux})';
    const expected = nlToSpace(`
      const bar = somevar[Symbol.for("foo")];
      const quux = somevar["baz"];
    `.trim());
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
