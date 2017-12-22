import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Html', () => {

  it('should compile a basic, self-closing html node', () => {
    assert.equal(compileCode('<br/>').trim(), 'MAPLE_.createElement("br", null, []);');
  });

  it('should not apply quotes when the html type is capitalized', () => {
    assert.equal(compileCode('<Foo/>').trim(), 'MAPLE_.createElement(Foo, null, []);');
  });

  it('should compile a self-closing html node with a string attribute', () => {
    assert.equal(compileCode('<br {:id "foo"}/>').trim(), 'MAPLE_.createElement("br", { [Symbol.for("id")]: "foo" }, []);');
  });

  it('should compile an empty html node with attributes', () => {
    const toCompile = `<div {:class "foo bar"}></div>`;
    const expected = `MAPLE_.createElement("div", { [Symbol.for("class")]: "foo bar" }, []);`;
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an html node with children', () => {
    const toCompile = '<div {:class "foo bar" :dataBaz quux}>\n'
                    + '  <ul>\n'
                    + '    <li {:class "foo"}></li>\n'
                    + '    <li {:class (bar baz)}></li>\n'
                    + '  </ul>\n'
                    + '</div>';
    const expected = nlToSpace(`MAPLE_.createElement("div", { [Symbol.for("class")]: "foo bar", [Symbol.for("dataBaz")]: quux }, [
      MAPLE_.createElement("ul", null, [
        MAPLE_.createElement("li", { [Symbol.for("class")]: "foo" }, []),
        MAPLE_.createElement("li", { [Symbol.for("class")]: bar(baz) }, [])
      ])
    ]);`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should allow creating new elements', () => {
    const toCompile = `
      (elem Foo [attrs children]
        <h1>children</h1>
      )
    `;
    const expected = nlToSpace(`
      const Foo = function (attrs, children) {
        const out_ = (function(){
          return MAPLE_.createElement("h1", null, [ children ]);
        }).call(this);
        if (out_ && MAPLE_.dataType(out_) !== 'htmlelement') {
          throw new Error('If Foo returns a truthy value, that value must be a single html element.');
        }
        return out_;
      };
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
