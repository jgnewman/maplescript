'use strict';

var _utils = require('../utils');

var _operator = require('./lists/operator');

var _operator2 = _interopRequireDefault(_operator);

var _contextChain = require('./lists/context-chain');

var _contextChain2 = _interopRequireDefault(_contextChain);

var _condition = require('./lists/condition');

var _condition2 = _interopRequireDefault(_condition);

var _immediateBlock = require('./lists/immediate-block');

var _immediateBlock2 = _interopRequireDefault(_immediateBlock);

var _html = require('./lists/html');

var _html2 = _interopRequireDefault(_html);

var _import = require('./lists/import');

var _import2 = _interopRequireDefault(_import);

var _export = require('./lists/export');

var _export2 = _interopRequireDefault(_export);

var _await = require('./lists/await');

var _await2 = _interopRequireDefault(_await);

var _function = require('./lists/function');

var _function2 = _interopRequireDefault(_function);

var _assignment = require('./lists/assignment');

var _assignment2 = _interopRequireDefault(_assignment);

var _destructure = require('./lists/destructure');

var _destructure2 = _interopRequireDefault(_destructure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compileTail(arr) {
  return arr.map(function (item) {
    return item.compile(true);
  }).join(', ');
}

function compileSpecial(form, items) {
  switch (form) {
    case '->':
      return _contextChain2.default.call(this, items);
    case 'all':
      return _operator2.default.call(this, '&&', items);
    case 'any':
      return _operator2.default.call(this, '||', items);
    case 'async':
      return _function2.default.call(this, items, true);
    case 'await':
      return _await2.default.call(this, items);
    case 'destr':
      return _destructure2.default.call(this, items);
    case 'do':
      return _immediateBlock2.default.call(this, items);
    case 'elem':
      return _html2.default.call(this, items);
    case 'export':
      return _export2.default.call(this, items);
    case 'fn':
      return _function2.default.call(this, items);
    case 'if':
      return _condition2.default.call(this, items);
    case 'import':
      return _import2.default.call(this, items);
    case 'make':
      return _assignment2.default.call(this, items);
    case 'none':
      return _operator2.default.call(this, '&& !', items, "true");
  }
}

/*
 * Create function calls and special forms
 */
(0, _utils.compile)(_utils.nodes.ListNode, function () {
  if (!this.items) (0, _utils.die)(this, 'Lists can not be empty.');

  var head = this.items[0];
  var tail = this.items.slice(1);

  var operatorForms = (0, _utils.getOperatorForms)();
  var specialForms = (0, _utils.getSpecialForms)();

  var compiledHead = head.compile(true);

  // Translate things like (+ 1 2 3) into (1 + 2 + 3)
  if (operatorForms.indexOf(compiledHead) >= 0) {
    return (0, _operator2.default)(compiledHead, tail);
  }

  // Translate things like (allof 1 2 3) into (1 && 2 && 3)
  // Also things like (if a 1 2) into (function() { if (a) { return 1 } else { return 2 }})()
  if (specialForms.indexOf(compiledHead) >= 0) {
    return compileSpecial.call(this, compiledHead, tail);
  }

  // Translate normal function calls
  return compiledHead + "(" + compileTail(tail) + ")";
});