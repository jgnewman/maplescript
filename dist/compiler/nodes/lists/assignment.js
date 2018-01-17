'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

function allArgsIdentifiers(args) {
  return args.every(function (arg) {
    return arg.type === 'Identifier';
  });
}

// We assume arguments are paired where the first of each
// pair is a pattern and the second is what to execute.
function getBodies(fnName, items) {
  var bodies = [];
  var body = void 0;

  items.forEach(function (item, index) {
    // pattern
    if (index % 2 === 0) {
      var pattern = item.items.slice(1);
      if (item.items[0].text !== fnName) return (0, _utils.die)(item, 'All patterns must use the same function name.');
      body = { pattern: pattern, allArgsIdentifiers: allArgsIdentifiers(pattern), action: null };

      // result
    } else {
      body.action = item;
      bodies.push(body);
    }
  });
  return bodies;
}

function getVars(patterns) {
  var args = [];
  patterns.forEach(function (pattern, index) {
    if (pattern.type === 'Identifier' && pattern.text !== '_') {
      args.push({ name: pattern.compile(), index: "[" + index + "]" });
    }
    if (pattern.type === 'Arr' && pattern.items.length === 1 && pattern.items[0].text.indexOf('|') >= 0) {
      var pieces = pattern.items[0].text.split('|');
      args.push({ name: pieces[0], index: "[" + index + "][0]" });
      args.push({ name: pieces[1], index: "[" + index + "].slice(1)" });
    }
  });
  return args;
}

function compilePolymorph(bodies) {
  return 'function () {\n' + 'const args_ = Array.prototype.slice.call(arguments || []);\n' + bodies.map(function (body) {

    var qualifier = null;

    var params = "[" + body.pattern.map(function (param) {
      if (param.type === 'List' && param.items[0].text === 'where') {
        qualifier = param.items[1];
        return '';
      }
      return '{type:"' + param.type + '", value: "' + param.compile().replace(/(\'|\"|\`)/g, "\\$1") + '" }';
    }).join(', ').replace(/, $/, '') + "]";

    var vars = getVars(body.pattern);
    var compiledVars = vars.map(function (varObj) {
      return 'var ' + varObj.name + ' = args_' + varObj.index;
    }).join(';\n') + ';\n';

    var actions = [body.action];
    if (body.action.type === 'List' && body.action.items[0].text === 'do') {
      actions = body.action.items.slice(1);
    }

    return 'if (MAPLE_.match_(args_, ' + params + ')) {\n' + (vars.length ? compiledVars : '') + (!qualifier ? '' : 'if (' + qualifier.compile() + ') {\n') + actions.map(function (action, index) {
      return (index === actions.length - 1 ? 'return ' : '') + action.compile();
    }).join(';\n') + ';\n' + (!qualifier ? '' : '}\n') + '}';
  }).join('\n') + " throw new Error('Could not find an argument match.');\n" + '}';
}

function compileAssignment(items) {
  if (items.length < 2) (0, _utils.die)(this, 'No unbound variables allowed.');

  // The pattern (make (foo x y) ...) denotes a named function.
  if (items[0].type === 'List') {
    var name = items[0].items[0].text;
    var bodies = getBodies(name, items);

    // not a polymorph
    if (bodies.length === 1 && bodies[0].allArgsIdentifiers) {
      var body = bodies[0];
      var actions = void 0;

      // No need to wrap `do` in a function in this case.
      if (body.action.type === 'List' && body.action.items[0].text === 'do') {
        actions = body.action.items.slice(1);
      } else {
        actions = [body.action];
      }

      return ('\n        const ' + items[0].items[0].compile() + ' = function (' + body.pattern.map(function (arg) {
        return arg.compile();
      }).join(', ') + ') {\n          ' + actions.map(function (action, index) {
        return (index === actions.length - 1 ? 'return ' : '') + action.compile();
      }).join(';\n') + ';\n        }\n      ').trim();

      // polymorph!
    } else {
      return "const " + items[0].items[0].compile() + " = " + compilePolymorph(bodies);
    }

    // Not a named function
  } else {
    return "const " + items[0].compile() + " = " + items[1].compile();
  }
}

exports.default = compileAssignment;