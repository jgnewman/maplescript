import { compile, nodes, getSpecialForms, getOperatorForms, die, ensurePolymorphicStructure } from '../utils';

function compileOperator(op, items, prepend) {
  return "("
    + (prepend ? (prepend + ' ' + op + ' ') : '')
    + items.map(item => item.compile(true)).join(' ' + op + ' ')
    + ")";
}

function compileTail(arr) {
  return arr.map(item => item.compile(true)).join(', ');
}

function compileContextChain(items) {
  return `(function(){
    var ref_ = this;
    ${items.map(item => {
      return "(function(){ ref_ = " + item.compile(true) + " }).call(ref_);"
    }).join('\n')}
    return ref_;
  }).call(this)`;
}

function compileCondition(items) {
  let sets = [];
  let ifcase = null;
  let elsecase = null;

  items.forEach((item, index) => {
    if (index % 2 === 0) sets.push([item, items[index + 1]])
  });

  if (sets[sets.length - 1][1] === undefined) {
    elsecase = sets.pop()[0];
  }

  ifcase = sets.shift();

  return ""
    + "(function () {\n"
    +   "if (" + ifcase[0].compile(true) + ") {\nreturn " + ifcase[1].compile(true) + "\n}"
    +   sets.map(pair => " else if (" + pair[0].compile(true) + ") {\nreturn " + pair[1].compile(true) + "\n}").join('')
    +   (!elsecase ? " else {\nreturn\n}" : " else {\nreturn " + elsecase.compile(true) + "\n}")
    + "\n}).call(this)";
}

function getVarsFromParamList(items, isPolymorph) {
  const vars = [];
  items.forEach((param, paramIndex) => {
    if (param.type === 'Identifier') {
      param.text !== '_' && vars.push({varName: param.compile(true), position: `args[${paramIndex}]`});

    } else if (param.type === 'Arr') {
      param.items.forEach((name, index) => {
        name = name.compile(true);
        if (name.indexOf('|') >= 0) {
          const pieces = name.split('|');
          pieces[0] !== '_' && vars.push({varName: pieces[0], position: `args[${paramIndex}][0]`});
          pieces[1] !== '_' &&vars.push({varName: pieces[1], position: `args[${paramIndex}].slice(1)`});
        } else {
          vars.push({varName: param.compile(true), position: `args[${paramIndex}][${index}]`});
        }
      })

    } else {
      if (!isPolymorph) {
        die(param, 'You can only match patterns within \`of\` statements in polymorphic functions.')
      }
    }
  });
  return vars;
}

function compilePolymorph(body) {
  if (!ensurePolymorphicStructure(body)) die(this, `
    Something is wrong with your function structure. If this is not a polymorphic
    function, make sure you included a parameter list. If it is polymorphic,
    make sure it only contains \`of\` statements, and make sure each of these
    is structured like a normal function.
  `.trim().replace(/\s+/g, ' '));

  // Create `args` variable
  const argsLine = "const args = Array.prototype.slice.call(arguments || []);\n";

  // Compile conditional function funneling
  const compiledBodies = body.map((morph, index) => {
    const actions = morph.items.slice(2);

    const vars = getVarsFromParamList(morph.items[1].items, true);

    const params = "[" + morph.items[1].items.map(param => {
      return '{type:"' + param.type + '", value: "' + param.compile(true).replace(/(\'|\"|\`)/g, "\\$1") + '" }';
    }).join(', ') + "]";

    return  "if (PINE_.match_(args, " + params + ")) {\n"
          +   vars.map(obj => "var " + obj.varName + " = " + obj.position + ';\n').join('')
          +   actions.map((action, index) => {
                return (index === actions.length - 1 ? "return " : "") + action.compile(true);
              }).join(';\n') + ';\n'
          + "}\n";
  }).join('');

  const errLine = "throw new Error('Could not find an argument match.');\n";

  // Put the pieces together
  return "function () {\n" + argsLine + compiledBodies + errLine + "\n}";
}

// Handles all named and anonymous functions defined by the user
function compileFunction(body, async) {
  if (!async && body[0].type !== 'Arr') return compilePolymorph.call(this, body);

  // Die if the user accidentally put a top-level param list into a polymorph
  if (!async && body[1].type === 'List' && body[1].items[0] && body[1].items[0].text === 'of') die(this, `
    Polymorphic functions can not contain a parameter list outside of an \`of\`
    statement. Give each of these statements its own parameter list instead.
  `.trim().replace(/\s+/g, ' '));

  // Tweak the body to fit async functions
  let attemptChannel;
  if (async && body[0].type !== 'Arr') {
    if (body[0].type !== 'Atom') die('Async functions must either begin with a parameter list or a symbol.');
    attemptChannel = body[0].compile(true);
    body = body.slice(1);
  }

  // Create list of parameters
  const params = getVarsFromParamList(body[0].items);
  const varsLine = params.length ? params.map(obj => {
    return "var " + obj.varName + " = " + obj.position + ';\n';
  }).join('') : '';

  // Create `args` variable
  const argsLine = "const args = Array.prototype.slice.call(arguments || []);\n";

  // Assuming the first item is a list of parameters, compiles the remainder
  // of the body.
  const bodyActions = body.slice(1);
  const cleanBody = bodyActions.map((action, index) => {
    return (index === bodyActions.length - 1 ? "return " : "") + action.compile(true);
  }).join(';\n') + ';';

  // Put the pieces together
  if (async && attemptChannel) {
    return `async function () {
      try {
        ${argsLine}
        ${varsLine}
        ${cleanBody}
      } catch (err_) {
        return PINE_.signal(${attemptChannel}, err);
      }
    }`;
  } else {
    return (async ? "async " : "") + "function () {\n" + argsLine + varsLine + cleanBody + "\n}";
  }
}

function listIsPolymorph(listNode) {
  if (listNode.type !== 'List') return false;
  return listNode && listNode.items[0] && listNode.items[0].type === 'Identifier' && listNode.items[0].text === 'of';
}

function compileAssignment(items) {
  if (items.length < 2) die(this, 'No unbound variables allowed.');
  // Not a function
  if (items.length < 3 && !listIsPolymorph(items[1])) return "const " + items[0].compile(true) + " = " + items[1].compile(true);
  // Function
  return "const " + items[0].compile(true) + " = " + compileFunction.call(this, items.slice(1));
}

function compileDoBlock(items) {
  const body = items.map((action, index) => {
    return (index === items.length - 1 ? "return " : "") + action.compile(true);
  }).join(';\n') + ';';
  return "(function () {\n"+ body +"\n}).call(this)";
}

function compileHtmlDefinition(items) {
  const name = items[0].compile(true);
  const params = items[1].items.map(param => param.compile(true)).join(', ');
  const body = compileDoBlock.call(this, items.slice(2));

  if (!/^[A-Z]/.test(name)) {
    die(items[0], 'New html tags must begin with a capital letter.');
  }

  return `(PINE_.html_.${name} = PINE_.html_.${name} || function (${params}) {
    const out_ = ${body};
    if (out_ && PINE_.dataType(out_) !== 'htmlelement') {
      throw new Error('If ${name} returns a truthy value, that value must be a single html element.');
    }
    return out_;
  })`
}

function compileImport(items) {
  if (items.length === 1) { // just location
    return `require(${items[0].compile(true)})`;
  }

  if (items.length === 2) { // location and name
    return `const ${items[1].compile(true)} = require(${items[0].compile(true)})`;
  }

  die(this, 'Import statements can only take 1 or 2 arguments.');
}

function aritize(word) {
  const arityMatch = /\/\d+$/;
  let arity = null;
  if (arityMatch.test(word)) {
    arity = word.match(arityMatch)[0].slice(1);
    word = word.replace(arityMatch, '');
  }
  return {
    clean: word,
    aritized: arity ? `PINE_.aritize_(${word}, ${arity})` : word
  };
}

function compileExport(items) {
  const toExport = items[0];

  if (items.length > 1) {
    die(this, 'You can only export a single value. Try an object or an array instead.');
  }

  if (toExport.type === 'Arr') {
    return 'module.exports = {'
      + toExport.items.map(item => {
          const ident = aritize(item.compile(true));
          return `[Symbol.for("${ident.clean}")]: ${ident.aritized}`;
        }).join(', ')
      + '}'
  }

  if (toExport.type === 'Obj') {
    return 'module.exports = {'
      + toExport.items.map((item, index) => {
          if (index % 2 === 0) { // key
            const atom = item.type === 'Atom';
            return (atom ? '[' : '"') + item.compile(true) + (atom ? ']' : '"') + ':';
          } else { // value
            const ident = aritize(item.compile(true));
            return ident.aritized + (index === toExport.length - 1 ? '' : ',');
          }
        }).join(' ')
      + '}';
  }

  if (toExport.type === 'Identifier') {
    const ident = aritize(toExport.compile(true));
    return `module.exports = {[Symbol.for("${ident.clean}")]: ${ident.aritized}}`;
  }

  die(this, 'You can only export named references.');
}

function compileAwait(items) {
  if (items.length > 1) {
    return die(this, 'Await can only take 1 argument.')
  }
  return `await ${items[0].compile(true)}`
}

function compileSpecial(form, items) {
  switch (form) {
    case '->': return compileContextChain.call(this, items);
    case 'all': return compileOperator.call(this, '&&', items);
    case 'any': return compileOperator.call(this, '||', items);
    case 'async': return compileFunction.call(this, items, true);
    case 'await': return compileAwait.call(this, items);
    case 'do': return compileDoBlock.call(this, items);
    case 'elem': return compileHtmlDefinition.call(this, items);
    case 'export': return compileExport.call(this, items);
    case 'fn': return compileFunction.call(this, items);
    case 'if': return compileCondition.call(this, items);
    case 'import': return compileImport.call(this, items);
    case 'make': return compileAssignment.call(this, items);
    case 'none': return compileOperator.call(this, '&& !', items, "true");
  }
}

/*
 * Create function calls and special forms
 */
compile(nodes.ListNode, function () {
  if (!this.items) die(this, 'Lists can not be empty.');

  const head = this.items[0];
  const tail = this.items.slice(1);

  const operatorForms = getOperatorForms();
  const specialForms = getSpecialForms();

  const compiledHead = head.compile(true);

  // Translate things like (+ 1 2 3) into (1 + 2 + 3)
  if (operatorForms.indexOf(compiledHead) >= 0) {
    return compileOperator(compiledHead, tail);
  }

  // Translate things like (allof 1 2 3) into (1 && 2 && 3)
  // Also things like (if a 1 2) into (function() { if (a) { return 1 } else { return 2 }})()
  if (specialForms.indexOf(compiledHead) >= 0) {
    return compileSpecial.call(this, compiledHead, tail);
  }

  // Translate normal function calls
  return compiledHead + "(" + compileTail(tail) + ")";
});
