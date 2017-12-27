'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function compileOperator(op, items, prepend) {

  switch (op) {
    case '=':
      op = '===';break;
    case '!=':
      op = '!==';break;
    case '?<':
      op = '<';break;
    case '?>':
      op = '>';break;
  }

  return "(" + (prepend ? prepend + ' ' + op + ' ' : '') + items.map(function (item) {
    return item.compile(true);
  }).join(' ' + op + ' ') + ")";
}

exports.default = compileOperator;