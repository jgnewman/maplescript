import { compile, nodes, compileBody, die } from '../utils';

function compileAttrs(attrs) {
  if (!attrs) return "null";
  return attrs.compile();
}

/*
 * Translate tuples 1-1.
 */
compile(nodes.HtmlNode, function () {
  let   name  = this.openTag.compile();
  const body  = this.body ? compileBody(this.body, ',') : '';
  const close = !this.selfClosing ? this.closeTag.replace(/^\<\/\s*|\s*\>$/g, '') : null;
  const attrs = compileAttrs(this.attrs);
  if (!this.selfClosing && close !== name.replace(/[\'\"\`]/g, '')) {
    die(this, `Closing tag "${close}" does not match opening tag ${name}.`);
  }
  if (!/^[A-Z]/.test(name)) {
    name = '"' + name + '"';
  }
  return `MAPLE_[Symbol.for("vdom")][Symbol.for("create")](${name}, ${attrs}, [${body ? '\n' + body + '\n' : ''}])`;
});
