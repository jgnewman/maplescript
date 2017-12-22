'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

var _function = require('./function');

var _function2 = _interopRequireDefault(_function);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function listIsPolymorph(listNode) {
  if (listNode.type !== 'List') return false;
  return listNode && listNode.items[0] && listNode.items[0].type === 'Identifier' && listNode.items[0].text === 'of';
}

function compileAssignment(items) {
  if (items.length < 2) (0, _utils.die)(this, 'No unbound variables allowed.');
  // Not a function
  if (items.length < 3 && !listIsPolymorph(items[1])) return "const " + items[0].compile(true) + " = " + items[1].compile(true);
  // Function
  return "const " + items[0].compile(true) + " = " + _function2.default.call(this, items.slice(1));
}

exports.default = compileAssignment;