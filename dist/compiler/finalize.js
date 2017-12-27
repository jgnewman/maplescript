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

function finalize(tree, isMapleProjectDirectory) {
  var libLocation = isMapleProjectDirectory ? _path2.default.resolve(__dirname, '../', '../', 'library') : 'maplescript/library';
  tree.shared.output = prepend(tree.shared.output, 'var MAPLE_ = m = require("' + libLocation + '");\n');
  return tree;
}