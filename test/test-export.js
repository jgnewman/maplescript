import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Export', () => {

  it('should compile a single reference as an object', () => {
    const toCompile = '(export foo)';
    assert.equal(compileCode(toCompile).trim(), 'module.exports = {[Symbol.for("foo")]: foo};');
  });

  it('should compile a single reference as an object with aritization', () => {
    const toCompile = '(export foo/2)';
    assert.equal(compileCode(toCompile).trim(), 'module.exports = {[Symbol.for("foo")]: PINE_.aritize_(foo, 2)};');
  });

  it('should compile an array of references as an object', () => {
    const toCompile = '(export [foo bar])';
    assert.equal(compileCode(toCompile).trim(), 'module.exports = {[Symbol.for("foo")]: foo, [Symbol.for("bar")]: bar};');
  });

  it('should compile an object of references as an object', () => {
    const toCompile = '(export {:foo bar :baz quux})';
    assert.equal(compileCode(toCompile).trim(), 'module.exports = {[Symbol.for("foo")]: bar, [Symbol.for("baz")]: quux};');
  });

});
