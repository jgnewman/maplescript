'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = finalize;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

function finalize(tree, isPineProjectDirectory) {
  var libLocation = isPineProjectDirectory ? _path2.default.resolve(__dirname, '../', '../', 'library') : 'pine/library';
  tree.shared.output = prepend(tree.shared.output, 'var PINE_ = require("' + libLocation + '");\n');
  return tree;
}