'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

function getVarsFromParamList(items, isPolymorph) {
  var vars = [];
  items.forEach(function (param, paramIndex) {
    if (param.type === 'Identifier') {
      param.text !== '_' && vars.push({ varName: param.compile(true), position: 'args[' + paramIndex + ']' });
    } else if (param.type === 'Arr') {
      param.items.forEach(function (name, index) {
        name = name.compile(true);
        if (name.indexOf('|') >= 0) {
          var pieces = name.split('|');
          pieces[0] !== '_' && vars.push({ varName: pieces[0], position: 'args[' + paramIndex + '][0]' });
          pieces[1] !== '_' && vars.push({ varName: pieces[1], position: 'args[' + paramIndex + '].slice(1)' });
        } else {
          vars.push({ varName: param.compile(true), position: 'args[' + paramIndex + '][' + index + ']' });
        }
      });
    } else {
      if (!isPolymorph) {
        (0, _utils.die)(param, 'You can only match patterns within \`of\` statements in polymorphic functions.');
      }
    }
  });
  return vars;
}

function compilePolymorph(body) {
  if (!(0, _utils.ensurePolymorphicStructure)(body)) (0, _utils.die)(this, '\n    Something is wrong with your function structure. If this is not a polymorphic\n    function, make sure you included a parameter list. If it is polymorphic,\n    make sure it only contains `of` statements, and make sure each of these\n    is structured like a normal function.\n  '.trim().replace(/\s+/g, ' '));

  // Create `args` variable
  var argsLine = "const args = Array.prototype.slice.call(arguments || []);\n";

  // Compile conditional function funneling
  var compiledBodies = body.map(function (morph, index) {
    var actions = morph.items.slice(2);
    var paramList = morph.items[1];

    var vars = getVarsFromParamList(morph.items[1].items, true);

    var params = "[" + paramList.items.map(function (param) {
      return '{type:"' + param.type + '", value: "' + param.compile(true).replace(/(\'|\"|\`)/g, "\\$1") + '" }';
    }).join(', ') + "]";

    var qualifier = paramList.qualifier ? paramList.qualifier.compile(true) : null;

    return "if (MAPLE_.match_(args, " + params + ")) {\n" + vars.map(function (obj) {
      return "var " + obj.varName + " = " + obj.position + ';\n';
    }).join('') + (qualifier ? 'if (' + qualifier + ') {\n' : "") + actions.map(function (action, index) {
      return (index === actions.length - 1 ? "return " : "") + action.compile(true);
    }).join(';\n') + ';\n' + (qualifier ? "}\n" : "") + "}\n";
  }).join('');

  var errLine = "throw new Error('Could not find an argument match.');\n";

  // Put the pieces together
  return "function () {\n" + argsLine + compiledBodies + errLine + "\n}";
}

// Handles all named and anonymous functions defined by the user
function compileFunction(body, async) {
  if (!async && body[0].type !== 'Arr') return compilePolymorph.call(this, body);

  // Die if the user accidentally put a top-level param list into a polymorph
  // i.e. (make foo [x y] (of ... ))
  if (!async && body[1].type === 'List' && body[1].items[0] && body[1].items[0].text === 'of') (0, _utils.die)(this, '\n    Polymorphic functions can not contain a parameter list outside of an `of`\n    statement. Give each of these statements its own parameter list instead.\n  '.trim().replace(/\s+/g, ' '));

  // Tweak the body to fit async functions
  var attemptChannel = void 0;
  if (async && body[0].type !== 'Arr') {
    if (body[0].type !== 'Symbol') (0, _utils.die)('Async functions must either begin with a parameter list or a symbol.');
    attemptChannel = body[0].compile(true);
    body = body.slice(1);
  }

  // Create list of parameters
  var params = getVarsFromParamList(body[0].items);
  var varsLine = params.length ? params.map(function (obj) {
    return "var " + obj.varName + " = " + obj.position + ';\n';
  }).join('') : '';

  // Create `args` variable
  var argsLine = "const args = Array.prototype.slice.call(arguments || []);\n";

  // Assuming the first item is a list of parameters, compiles the remainder
  // of the body.
  var bodyActions = body.slice(1);
  var cleanBody = bodyActions.map(function (action, index) {
    return (index === bodyActions.length - 1 ? "return " : "") + action.compile(true);
  }).join(';\n') + ';';

  // Put the pieces together
  if (async && attemptChannel) {
    return 'async function () {\n      try {\n        ' + argsLine + '\n        ' + varsLine + '\n        ' + cleanBody + '\n      } catch (err_) {\n        return MAPLE_[Symbol.for("signal")](' + attemptChannel + ', err_);\n      }\n    }';
  } else {
    return (async ? "async " : "") + "function () {\n" + argsLine + varsLine + cleanBody + "\n}";
  }
}

exports.default = compileFunction;