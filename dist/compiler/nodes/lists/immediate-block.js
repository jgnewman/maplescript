"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function compileDoBlock(items) {
  var body = items.map(function (action, index) {
    return (index === items.length - 1 ? "return " : "") + action.compile(true);
  }).join(';\n') + ';';
  return "(function(){\n" + body + "\n}).call(this)";
}

exports.default = compileDoBlock;