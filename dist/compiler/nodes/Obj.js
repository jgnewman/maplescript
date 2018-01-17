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
      var isSymbol = item.type === 'Symbol';
      var isString = item.type === 'String';
      var compiled = item.compile();

      if (isSymbol) {
        return '[' + compiled + ']:';
      } else if (isString) {
        return compiled + ':';
      } else {
        return '"' + compiled + '":';
      }
    } else {
      // value
      return item.compile() + (index === _this.length - 1 ? '' : ',');
    }
  }).join(' ') + ' }';
});