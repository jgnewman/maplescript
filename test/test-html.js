import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Html', () => {

  it('should compile a basic, self-closing html node', () => {
    assert.equal(compileCode('<br/>').trim(), 'PINE_.createElement("br", null, []);');
  });

  it('should compile a self-closing html node with a string attribute', () => {
    assert.equal(compileCode('<br {:id "foo"}/>').trim(), 'PINE_.createElement("br", { [Symbol.for("id")]: "foo" }, []);');
  });

  it('should compile an empty html node with attributes', () => {
    const toCompile = `<div {:class "foo bar"}></div>`;
    const expected = `PINE_.createElement("div", { [Symbol.for("class")]: "foo bar" }, []);`;
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an html node with children', () => {
    const toCompile = '<div {:class "foo bar" :dataBaz quux}>\n'
                    + '  <ul>\n'
                    + '    <li {:class "foo"}></li>\n'
                    + '    <li {:class (bar baz)}></li>\n'
                    + '  </ul>\n'
                    + '</div>';
    const expected = nlToSpace(`PINE_.createElement("div", { [Symbol.for("class")]: "foo bar", [Symbol.for("dataBaz")]: quux }, [
      PINE_.createElement("ul", null, [
        PINE_.createElement("li", { [Symbol.for("class")]: "foo" }, []),
        PINE_.createElement("li", { [Symbol.for("class")]: bar(baz) }, [])
      ])
    ]);`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
