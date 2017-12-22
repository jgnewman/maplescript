import { die, ensurePolymorphicStructure } from '../../utils';

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
    if (body[0].type !== 'Symbol') die('Async functions must either begin with a parameter list or a symbol.');
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
        return PINE_.signal(${attemptChannel}, err_);
      }
    }`;
  } else {
    return (async ? "async " : "") + "function () {\n" + argsLine + varsLine + cleanBody + "\n}";
  }
}


export default compileFunction;
