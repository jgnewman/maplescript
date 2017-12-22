import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Functions', () => {

  it('should compile a named function', () => {
    const toCompile = `
      (make foo [x _ y]
        (+ x y)
        (- x y))
    `;
    const expected = nlToSpace(`
      const foo = function () {
        const args = Array.prototype.slice.call(arguments || []);
        var x = args[0];
        var y = args[2];
        (x + y);
        return (x - y);
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an anonymous function', () => {
    const toCompile = `
      (fn []
        (+ x y)
        (- x y))
    `;
    const expected = nlToSpace(`
      function () {
        const args = Array.prototype.slice.call(arguments || []);
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
      (async []
        (make foo (await (bar)))
        foo)
    `;
    const expected = nlToSpace(`
      async function () {
        const args = Array.prototype.slice.call(arguments || []);
        const foo = await bar();
        return foo;
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an async function with an error channel', () => {
    const toCompile = `
      (async :err []
        (make foo (await (bar)))
        foo)
    `;
    const expected = nlToSpace(`
      async function () {
        try {
          const args = Array.prototype.slice.call(arguments || []);
          const foo = await bar();
          return foo;
        } catch (err_) {
          return PINE_.signal(Symbol.for("err"), err_);
        }
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a non-polymorphic function', () => {
    const toCompile = `
      (make foo [x _ y]
        (+ x y)
        (- x y))
    `;
    const expected = nlToSpace(`
      const foo = function () {
        const args = Array.prototype.slice.call(arguments || []);
        var x = args[0];
        var y = args[2];
        (x + y);
        return (x - y);
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a polymorphic function', () => {
    const toCompile = `
      (make foo
        (of [1] 1)
        (of [2 n] 2)
        (of [n _] 3)
        (of [[hd|tl]] 4)
        (of [n :: (= n 5)] 5))
    `;
    const expected = nlToSpace(`
      const foo = function () {
        const args = Array.prototype.slice.call(arguments || []);
        if (PINE_.match_(args, [{type:"Number", value: "1" }])) {
          return 1;
        }
        if (PINE_.match_(args, [{type:"Number", value: "2" }, {type:"Identifier", value: "n" }])) {
          var n = args[1];
          return 2;
        }
        if (PINE_.match_(args, [{type:"Identifier", value: "n" }, {type:"Identifier", value: "_" }])) {
          var n = args[0];
          return 3;
        }
        if (PINE_.match_(args, [{type:"Arr", value: "[hd|tl]" }])) {
          var hd = args[0][0];
          var tl = args[0].slice(1);
          return 4;
        }
        if (PINE_.match_(args, [{type:"Identifier", value: "n" }])) {
          var n = args[0];
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
