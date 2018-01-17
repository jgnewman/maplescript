'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOperatorForms = exports.getSpecialForms = exports.getReservedWords = exports.getExposedFns = exports.compileBody = exports.compile = exports.die = exports.nodes = exports.parser = undefined;

var _parser = require('../parser/parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodes = _parser2.default.parser.nodes;

/**
 * Create an error, log a problem, and die.
 *
 * @param  {Node}   node     Any compilable node.
 * @param  {String} problem  Optional. A problem to log to the console.
 *
 * @return {undefined}
 */
function die(node, problem) {
  console.log('\nERROR compiling ' + node.type + ' node between ' + node.loc.start.line + ':' + node.loc.start.column + ' and ' + node.loc.end.line + ':' + node.loc.end.column + '.\n');
  problem && console.log('Problem: ' + problem + '\n');
  console.log(new Error().stack);
  process.exit(1);
}

/**
 * Attach a compile function to a node's prototype.
 *
 * @param  {Class}    node  A parser node.
 * @param  {Function} fn    The compile function.
 *
 * @return {undefined}
 */
function compile(node, fn) {
  node.prototype.compile = function () {
    try {
      return fn.bind(this)();
    } catch (err) {
      console.log('\nERROR compiling ' + this.type + ' node between ' + this.loc.start.line + ':' + this.loc.start.column + ' and ' + this.loc.end.line + ':' + this.loc.end.column + '.\n');
      console.log(err.stack);
      process.exit(1);
    }
  };
}

/**
 * Runs through a series of compilable nodes, compiles them all,
 * and returns the last one.
 *
 * @param  {Array}  body   A list of compilable nodes.
 * @param  {String} delim  A delimiter to use. Defaults to ';'
 *
 * @return {String}      The compiled string.
 */
function compileBody(body, delim) {
  var end = delim || ';';
  var bodyPieces = [];
  body.forEach(function (item, index) {
    var prefix = index === body.length - 1 && !delim ? 'return ' : '';
    if (!item.compile) {
      throw new Error('Item type ' + item.type + ' has no compile method.');
    }
    bodyPieces.push(prefix + item.compile(true));
  });
  return !bodyPieces.length ? '' : bodyPieces.join(end + '\n') + (delim === ';' ? ';' : '');
}

// Official list of exposed system functions
function getExposedFns() {
  return [">>="];
}

function getOperatorForms() {
  return ["+", "-", "*", "/", "%", "=", "!=", "?<", "?>", "<=", ">="];
}

function getSpecialForms() {
  return ['->', 'all', 'any', 'await', 'destr', 'do', 'export', 'if', 'import', 'make', 'none', 'not'];
}

// Official list of reserved words
function getReservedWords() {
  return ['break', 'catch', 'class', 'const', 'continue', 'default', 'delete', 'else', 'extends', 'enum', 'for', 'function', 'if', 'in', 'instanceof', 'let', 'of', 'return', 'static', 'super', 'switch', 'try', 'typeof', 'var', 'while', 'with'];
}

exports.parser = _parser2.default;
exports.nodes = nodes;
exports.die = die;
exports.compile = compile;
exports.compileBody = compileBody;
exports.getExposedFns = getExposedFns;
exports.getReservedWords = getReservedWords;
exports.getSpecialForms = getSpecialForms;
exports.getOperatorForms = getOperatorForms;