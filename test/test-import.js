import assert from 'assert';
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

});
