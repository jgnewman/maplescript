import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Import', () => {

  it('should compile an unreferenced import', () => {
    const toCompile = '(import "path/to/file")';
    assert.equal(compileCode(toCompile).trim(), 'require("path/to/file");');
  });

  it('should compile a referenced import', () => {
    const toCompile = '(import "path/to/file" mymod)';
    assert.equal(compileCode(toCompile).trim(), 'const mymod = require("path/to/file");');
  });

  it('should compile an import with an array of references', () => {
    const toCompile = `(import "path/to/file" [foo :bar])`;
    const expected = nlToSpace(`
      const foo = require("path/to/file")["foo"];
      const bar = require("path/to/file")[Symbol.for("bar")];
    `.trim());
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an import with an object of references', () => {
    const toCompile = `(import "path/to/file" {:foo bar baz quux})`;
    const expected = nlToSpace(`
      const bar = require("path/to/file")[Symbol.for("foo")];
      const quux = require("path/to/file")["baz"];
    `.trim());
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
