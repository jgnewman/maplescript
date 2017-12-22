MAPLEimport { compile, nodes, compileBody, die } from '../utils';

function compileAttrs(attrs) {
  if (!attrs) return "null";
  return attrs.compile(true);
}

/*
 * Translate tuples 1-1.
 */
compile(nodes.HtmlNode, function () {
  let   name  = this.openTag.compile(true);
  const body  = this.body ? compileBody(this.body, ',') : '';
  const close = !this.selfClosing ? this.closeTag.replace(/^\<\/\s*|\s*\>$/g, '') : null;
  const attrs = compileAttrs(this.attrs);
  if (!this.selfClosing && close !== name.replace(/[\'\"\`]/g, '')) {
    die(this, `Closing tag "${close}" does not match opening tag ${name}.`);
  }
  if (!/^[A-Z]/.test(name)) {
    name = '"' + name + '"';
  }
  return `MAPLE_.createElement(${name}, ${attrs}, [${body ? '\n' + body + '\n' : ''}])`;
});
