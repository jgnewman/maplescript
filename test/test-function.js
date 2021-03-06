import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Functions', () => {

  it('should compile a named function', () => {
    const toCompile = `
      (make (foo x y)
        (do (+ x y)
            (- x y)))
    `;
    const expected = nlToSpace(`
      const foo = function (x, y) {
        (x + y);
        return (x - y);
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an anonymous function', () => {
    const toCompile = `
      (@ []
        (+ x y)
        (- x y))
    `;
    const expected = nlToSpace(`
      function () {
        (x + y);
        return (x - y);
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an immediate function', () => {
    const toCompile = `
      (do
        (+ x y)
        (- x y))
    `;
    const expected = nlToSpace(`
      (function(){
        (x + y);
        return (x - y);
      }).call(this);
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an async function', () => {
    const toCompile = `
      (@async :channel []
        (make foo (await (bar)))
        foo)
    `;
    const expected = nlToSpace(`
      async function () {
        try {
          const foo = await bar();
          return foo;
        } catch (err_) {
          MAPLE_[Symbol.for("signal")](Symbol.for("channel"), err_);
        }
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a polymorphic function', () => {
    const toCompile = `
      (make (foo 1) 1
            (foo 2 n) 2
            (foo n _) 3
            (foo [hd|tl]) 4
            (foo n (where (= n 5))) 5)
    `;
    const expected = nlToSpace(`
      const foo = function () {
        const args_ = Array.prototype.slice.call(arguments || []);
        if (MAPLE_.match_(args_, [{type:"Number", value: "1" }])) {
          return 1;
        }
        if (MAPLE_.match_(args_, [{type:"Number", value: "2" }, {type:"Identifier", value: "n" }])) {
          var n = args_[1];
          return 2;
        }
        if (MAPLE_.match_(args_, [{type:"Identifier", value: "n" }, {type:"Identifier", value: "_" }])) {
          var n = args_[0];
          return 3;
        }
        if (MAPLE_.match_(args_, [{type:"Arr", value: "[hd|tl]" }])) {
          var hd = args_[0][0];
          var tl = args_[0].slice(1);
          return 4;
        }
        if (MAPLE_.match_(args_, [{type:"Identifier", value: "n" }])) {
          var n = args_[0];
          if ((n === 5)) {
            return 5;
          }
        }
        throw new Error('Could not find an argument match.');
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
