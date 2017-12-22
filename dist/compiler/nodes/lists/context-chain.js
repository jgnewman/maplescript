"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function compileContextChain(items) {
  return "(function(){\n    var ref_ = this;\n    " + items.map(function (item) {
    return "(function(){ ref_ = " + item.compile(true) + " }).call(ref_);";
  }).join('\n') + "\n    return ref_;\n  }).call(this)";
}

exports.default = compileContextChain;