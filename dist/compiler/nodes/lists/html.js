'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

var _immediateBlock = require('./immediate-block');

var _immediateBlock2 = _interopRequireDefault(_immediateBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compileHtmlDefinition(items) {
  var name = items[0].compile(true);
  var params = items[1].items.map(function (param) {
    return param.compile(true);
  }).join(', ');
  var body = _immediateBlock2.default.call(this, items.slice(2));

  if (!/^[A-Z]/.test(name)) {
    (0, _utils.die)(items[0], 'New html tags must begin with a capital letter.');
  }

  return 'const ' + name + ' = function (' + params + ') {\n    const out_ = ' + body + ';\n    return out_ || null;\n  }';
}

exports.default = compileHtmlDefinition;