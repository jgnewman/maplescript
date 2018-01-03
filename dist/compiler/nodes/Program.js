'use strict';

var _utils = require('../utils');

/*
 * Loop over all nodes in the program body and call
 * compile for each one. Make sure we have a shared string
 * to contain the output.
 */
(0, _utils.compile)(_utils.nodes.ProgramNode, function () {
  var _this = this;

  var newBody = this.body;
  this.shared.output = '';
  newBody.forEach(function (node) {
    try {
      node.compile();
      _this.shared.output += ';\n';
    } catch (err) {
      (0, _utils.die)(node, 'Could not compile ' + (node.type ? node.type : 'node ' + JSON.stringify(node)));
    }
  });
  return '';
});