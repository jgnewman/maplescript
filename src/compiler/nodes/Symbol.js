import { compile, nodes } from '../utils';

/*
 * Translate symbol syntax to js symbols.
 */
compile(nodes.SymbolNode, function () {
  return `Symbol.for("${this.text.slice(1)}")`;
});
