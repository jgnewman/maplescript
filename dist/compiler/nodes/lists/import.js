'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['Can only import symbols and variable identifiers.'], ['Can only import symbols and variable identifiers.']);

var _utils = require('../../utils');

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function compileImport(items) {
  var _this = this;

  if (items.length === 1) {
    // just location
    return 'require(' + items[0].compile() + ')';
  }

  if (items.length === 2) {
    // location and name(s)
    var modLocation = items[0].compile();

    switch (items[1].type) {

      case 'Identifier':
        return 'const ' + items[1].compile() + ' = require(' + modLocation + ')';

      case 'Arr':
        return items[1].items.map(function (key) {

          if (key.type === 'Symbol') {
            var text = key.text.replace(/^\:/, '');
            if (/[^A-Za-z_\$]/.test(text)) (0, _utils.die)(_this, 'Can not implicitly translate key ' + key.text + ' to a variable name as it contains characters not allowed in JavaScript variables.');
            return 'const ' + text + ' = require(' + modLocation + ')[' + key.compile() + ']';
          } else {
            var compiledKey = key.compile();
            if (key.type !== 'Identifier') (0, _utils.die)(_this(_templateObject));
            return 'const ' + compiledKey + ' = require(' + modLocation + ')["' + compiledKey + '"]';
          }
        }).join(';\n');

      case 'Obj':
        var pairs = [];
        var pair = [];
        items[1].items.forEach(function (keyVal, index) {
          pair.push(keyVal);
          if (index % 2 !== 0) {
            pairs.push(pair);
            pair = [];
          }
        });

        return pairs.map(function (pair) {
          var key = pair[0].compile();
          var val = pair[1].compile();

          return 'const ' + val + ' = require(' + modLocation + ')[' + (pair[0].type === 'Identifier' ? '"' + key + '"' : key) + ']';
        }).join(';\n');

      default:
        return (0, _utils.die)(this, 'Import identifiers must be in the form of a variable identifier, an array, or an object.');
    }
  }

  (0, _utils.die)(this, 'Import statements can only take 1 or 2 arguments.');
}

exports.default = compileImport;