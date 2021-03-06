import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Html', () => {

  it('should compile a basic, self-closing html node', () => {
    assert.equal(compileCode('<br/>').trim(), 'MAPLE_[Symbol.for("vdom")][Symbol.for("create")]("br", null, []);');
  });

  it('should not apply quotes when the html type is capitalized', () => {
    assert.equal(compileCode('<Foo/>').trim(), 'MAPLE_[Symbol.for("vdom")][Symbol.for("create")](Foo, null, []);');
  });

  it('should compile a self-closing html node with a string attribute', () => {
    assert.equal(compileCode('<br {:id "foo"}/>').trim(), 'MAPLE_[Symbol.for("vdom")][Symbol.for("create")]("br", { [Symbol.for("id")]: "foo" }, []);');
  });

  it('should compile an empty html node with attributes', () => {
    const toCompile = `<div {:class "foo bar"}></div>`;
    const expected = `MAPLE_[Symbol.for("vdom")][Symbol.for("create")]("div", { [Symbol.for("class")]: "foo bar" }, []);`;
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an html node with children', () => {
    const toCompile = '<div {:class "foo bar" :dataBaz quux}>\n'
                    + '  <ul>\n'
                    + '    <li {:class "foo"}></li>\n'
                    + '    <li {:class (bar baz)}></li>\n'
                    + '  </ul>\n'
                    + '</div>';
    const expected = nlToSpace(`MAPLE_[Symbol.for("vdom")][Symbol.for("create")]("div", { [Symbol.for("class")]: "foo bar", [Symbol.for("dataBaz")]: quux }, [
      MAPLE_[Symbol.for("vdom")][Symbol.for("create")]("ul", null, [
        MAPLE_[Symbol.for("vdom")][Symbol.for("create")]("li", { [Symbol.for("class")]: "foo" }, []),
        MAPLE_[Symbol.for("vdom")][Symbol.for("create")]("li", { [Symbol.for("class")]: bar(baz) }, [])
      ])
    ]);`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
