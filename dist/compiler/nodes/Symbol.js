'use strict';

var _utils = require('../utils');

/*
 * Translate symbol syntax to js symbols.
 */
(0, _utils.compile)(_utils.nodes.SymbolNode, function () {
  return 'Symbol.for("' + this.text.slice(1) + '")';
});