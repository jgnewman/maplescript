'use strict';

var _utils = require('../utils');

function compileAttrs(attrs) {
  if (!attrs) return "null";
  return attrs.compile(true);
}

/*
 * Translate tuples 1-1.
 */
(0, _utils.compile)(_utils.nodes.HtmlNode, function () {
  var name = this.openTag.compile(true);
  var body = this.body ? (0, _utils.compileBody)(this.body, ',') : '';
  var close = !this.selfClosing ? this.closeTag.replace(/^\<\/\s*|\s*\>$/g, '') : null;
  var attrs = compileAttrs(this.attrs);
  if (!this.selfClosing && close !== name.replace(/[\'\"\`]/g, '')) {
    (0, _utils.die)(this, 'Closing tag "' + close + '" does not match opening tag ' + name + '.');
  }
  if (!/^[A-Z]/.test(name)) {
    name = '"' + name + '"';
  }
  return 'MAPLE_.vdom[Symbol.for("create")](' + name + ', ' + attrs + ', [' + (body ? '\n' + body + '\n' : '') + '])';
});