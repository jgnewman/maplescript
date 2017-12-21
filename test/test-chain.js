import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Context Chain', () => {

  it('should compile a context chain', () => {
    const toCompile = `
      (-> ($ foo)
          (@addClass bar)
          (@addClass baz))
    `;
    const expected = nlToSpace(`(function(){
      var ref_ = this;
      (function(){ ref_ = $(foo) }).call(ref_);
      (function(){ ref_ = this["addClass"](bar) }).call(ref_);
      (function(){ ref_ = this["addClass"](baz) }).call(ref_);
      return ref_;
    }).call(this);`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
