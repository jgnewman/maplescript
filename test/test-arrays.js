import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Arrays', () => {

  it('should compile an empty array', () => {
    const toCompile = '[]';
    assert.equal(compileCode(toCompile).trim(), '[];');
  });

  it('should compile a single item array', () => {
    const toCompile = '[1]';
    assert.equal(compileCode(toCompile).trim(), '[1];');
  });

  it('should compile a multi item array', () => {
    const toCompile = '[1 2 3]';
    assert.equal(compileCode(toCompile).trim(), '[1, 2, 3];');
  });

});
