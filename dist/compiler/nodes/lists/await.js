'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

function compileAwait(items) {
  if (items.length > 1) {
    return (0, _utils.die)(this, 'Await can only take 1 argument.');
  }
  return 'await ' + items[0].compile(true);
}

exports.default = compileAwait;