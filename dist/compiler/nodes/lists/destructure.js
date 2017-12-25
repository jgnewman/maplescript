'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['Can only destructure symbols and variable identifiers.'], ['Can only destructure symbols and variable identifiers.']);

var _utils = require('../../utils');

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function compileDestructure(items) {
  var _this = this;

  if (items.length !== 2) {
    // just location
    return (0, _utils.die)(this, 'Destructure statements must take 2 arguments.');
  }

  var toDestructure = items[0].compile(true);
  var spec = items[1];

  switch (spec.type) {

    case 'Arr':
      // (destr props [:foo bar])
      return spec.items.map(function (key) {

        if (key.type === 'Symbol') {
          var text = key.text.replace(/^\:/, '');
          if (/[^A-Za-z_\$]/.test(text)) (0, _utils.die)(_this, 'Can not implicitly translate key ' + key.text + ' to a variable name as it contains characters not allowed in JavaScript variables.');
          return 'const ' + text + ' = ' + toDestructure + '[' + key.compile(true) + ']';
        } else {
          var compiledKey = key.compile(true);
          if (key.type !== 'Identifier') (0, _utils.die)(_this(_templateObject));
          return 'const ' + compiledKey + ' = ' + toDestructure + '["' + compiledKey + '"]';
        }
      }).join(';\n');

    case 'Obj':
      // (destr props {:foo bar :key val})
      var pairs = [];
      var pair = [];
      spec.items.forEach(function (keyVal, index) {
        pair.push(keyVal);
        if (index % 2 !== 0) {
          pairs.push(pair);
          pair = [];
        }
      });

      return pairs.map(function (pair) {
        var key = pair[0].compile(true);
        var val = pair[1].compile(true);

        return 'const ' + val + ' = ' + toDestructure + '[' + (pair[0].type === 'Identifier' ? '"' + key + '"' : key) + ']';
      }).join(';\n');

    default:
      return (0, _utils.die)(this, 'You must destructure using array or object form.');
  }
}

exports.default = compileDestructure;