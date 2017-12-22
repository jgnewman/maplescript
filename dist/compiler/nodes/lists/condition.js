"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function compileCondition(items) {
  var sets = [];
  var ifcase = null;
  var elsecase = null;

  items.forEach(function (item, index) {
    if (index % 2 === 0) sets.push([item, items[index + 1]]);
  });

  if (sets[sets.length - 1][1] === undefined) {
    elsecase = sets.pop()[0];
  }

  ifcase = sets.shift();

  return "" + "(function(){\n" + "if (" + ifcase[0].compile(true) + ") {\nreturn " + ifcase[1].compile(true) + "\n}" + sets.map(function (pair) {
    return " else if (" + pair[0].compile(true) + ") {\nreturn " + pair[1].compile(true) + "\n}";
  }).join('') + (!elsecase ? " else {\nreturn\n}" : " else {\nreturn " + elsecase.compile(true) + "\n}") + "\n}).call(this)";
}

exports.default = compileCondition;