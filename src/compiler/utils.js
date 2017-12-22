import parser from '../parser/parser';

const nodes = parser.parser.nodes;

/**
 * Create an error, log a problem, and die.
 *
 * @param  {Node}   node     Any compilable node.
 * @param  {String} problem  Optional. A problem to log to the console.
 *
 * @return {undefined}
 */
function die(node, problem) {
  console.log(`\nERROR compiling ${node.type} node between ${node.loc.start.line}:${node.loc.start.column} and ${node.loc.end.line}:${node.loc.end.column}.\n`);
  problem && console.log(`Problem: ${problem}\n`);
  console.log((new Error()).stack);
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
  node.prototype.compile = function (noAdd) {
    try {
      const out = fn.bind(this)();
      // By default, add our compiled node to the output
      // unless noAdd is set to true. Then don't.
      if (!noAdd) {
        this.shared.output += out;
      }
      return out;
    } catch (err) {
      console.log(`\nERROR compiling ${this.type} node between ${this.loc.start.line}:${this.loc.start.column} and ${this.loc.end.line}:${this.loc.end.column}.\n`);
      console.log(err.stack);
      process.exit(1);
    }
  };
}

/**
 * Removes NewLine nodes from a list of compilable nodes.
 *
 * @param  {Array} body  A list of compilable nodes.
 *
 * @return {Array}
 */
function removeNewlines(body) {
  return body.filter(item => item.type !== 'NewLine');
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
  const end = delim || ';';
  const cleanBody = removeNewlines(body);
  const bodyPieces = [];
  cleanBody.forEach((item, index) => {
    const prefix = (index === cleanBody.length - 1 && !delim) ? 'return ' : '' ;
    if (!item.compile) {
      throw new Error(`Item type ${item.type} has no compile method.`);
    }
    bodyPieces.push(prefix + item.compile(true));
  });
  return !bodyPieces.length ? '' : bodyPieces.join(`${end}\n`) + (delim === ';' ? ';' : '');
}

function ensurePolymorphicStructure(bodyItems) {
  let bad = false;
  bodyItems.some(item => {
    const isList = item.type === 'List';
    const isMorph = isList && item.items[0] && item.items[0].text === 'of';
    if (!isList || !isMorph) {
      bad = true;
      return true;
    }
  });
  return !bad;
}

// Official list of exposed system functions
function getExposedFns() {
  return [
    ">>=",
    'attempt',
    'apply',
    'createElement',
    'dangerouslyMutate',
    'dataType',
    'die',
    'dom',
    'domArray',
    'eql',
    'get',
    'gt',
    'gte',
    'handle',
    'head',
    'instance',
    'instanceof',
    'keys',
    'last',
    'lead',
    'log',
    'lt',
    'lte',
    'noop',
    'not',
    'random',
    'range',
    'remove',
    'signal',
    'tail',
    'throw',
    'unhandle',
    'update',
    'warn'
  ];
}

function getOperatorForms() {
  return [
    "+",
    "-",
    "*",
    "/",
    "%",
    "=",
    "!="
  ]
}

function getMsgPassingFns() {
  return [
    'spawn', 'receive', 'kill', 'reply', 'send'
  ];
}

function getSpecialForms() {
  return [
    '->',
    'all',
    'any',
    'async',
    'await',
    'destr',
    'do',
    'elem',
    'export',
    'fn',
    'if',
    'import',
    'make',
    'none'
  ];
}

// Official list of reserved words
function getReservedWords() {
  return [
    'break',
    'catch',
    'class',
    'const',
    'continue',
    'default',
    'delete',
    'else',
    'extends',
    'enum',
    'for',
    'function',
    'if',
    'in',
    'let',
    'of',
    'return',
    'static',
    'super',
    'switch',
    'try',
    'typeof',
    'var',
    'while',
    'with'
  ];
}

export {
  parser,
  nodes,
  die,
  compile,
  compileBody,
  getExposedFns,
  getMsgPassingFns,
  getReservedWords,
  getSpecialForms,
  getOperatorForms,
  ensurePolymorphicStructure
};
