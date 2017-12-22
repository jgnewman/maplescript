'use strict';

var _utils = require('../utils');

/*
 * Translate objects 1-1.
 */
(0, _utils.compile)(_utils.nodes.ObjNode, function () {
  var _this = this;

  return '{ ' + this.items.map(function (item, index) {
    if (index % 2 === 0) {
      // key
      var symbol = item.type === 'Symbol';
      return (symbol ? '[' : '"') + item.compile(true) + (symbol ? ']' : '"') + ':';
    } else {
      // value
      return item.compile(true) + (index === _this.length - 1 ? '' : ',');
    }
  }).join(' ') + ' }';
});