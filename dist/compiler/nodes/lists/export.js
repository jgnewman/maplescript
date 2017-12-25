'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

function aritize(word) {
  var arityMatch = /\/\d+$/;
  var arity = null;
  if (arityMatch.test(word)) {
    arity = word.match(arityMatch)[0].slice(1);
    word = word.replace(arityMatch, '');
  }
  return {
    clean: word,
    aritized: arity ? 'MAPLE_.aritize_(' + word + ', ' + arity + ')' : word
  };
}

function compileExport(items) {
  var toExport = items[0];

  if (items.length > 1) {
    (0, _utils.die)(this, 'You can only export a single value. Try an object or an array instead.');
  }

  if (toExport.type === 'Arr') {
    return 'module.exports = {' + toExport.items.map(function (item) {
      var ident = aritize(item.compile(true));
      return '[Symbol.for("' + ident.clean + '")]: ' + ident.aritized;
    }).join(', ') + '}';
  }

  if (toExport.type === 'Obj') {
    return 'module.exports = {' + toExport.items.map(function (item, index) {
      if (index % 2 === 0) {
        // key
        var symbol = item.type === 'Symbol';
        return (symbol ? '[' : '"') + item.compile(true) + (symbol ? ']' : '"') + ':';
      } else {
        // value
        var ident = aritize(item.compile(true));
        return ident.aritized + (index === toExport.length - 1 ? '' : ',');
      }
    }).join(' ') + '}';
  }

  if (toExport.type === 'Identifier') {
    var ident = aritize(toExport.compile(true));
    return 'module.exports = {[Symbol.for("' + ident.clean + '")]: ' + ident.aritized + '}';
  }

  (0, _utils.die)(this, 'You can only export named references.');
}

exports.default = compileExport;