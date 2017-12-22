'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function compileOperator(op, items, prepend) {

  if (op === '=') {
    op = '===';
  } else if (op === '!=') {
    op = '!==';
  }

  return "(" + (prepend ? prepend + ' ' + op + ' ' : '') + items.map(function (item) {
    return item.compile(true);
  }).join(' ' + op + ' ') + ")";
}

exports.default = compileOperator;