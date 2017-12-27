import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Logic', () => {

  it('should compile an all expression', () => {
    const toCompile = '(all foo bar baz)';
    assert.equal(compileCode(toCompile).trim(), '(foo && bar && baz);');
  });

  it('should compile an any expression', () => {
    const toCompile = '(any foo bar baz)';
    assert.equal(compileCode(toCompile).trim(), '(foo || bar || baz);');
  });

  it('should compile an none expression', () => {
    const toCompile = '(none foo bar baz)';
    assert.equal(compileCode(toCompile).trim(), '(true && ! foo && ! bar && ! baz);');
  });

  it('should compile a not expression', () => {
    const toCompile = '(not foo)';
    assert.equal(compileCode(toCompile).trim(), '(true && ! foo);');
  });

});
