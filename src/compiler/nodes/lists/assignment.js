import { die } from '../../utils';

function allArgsIdentifiers(args) {
  return args.every(arg => arg.type === 'Identifier');
}

// We assume arguments are paired where the first of each
// pair is a pattern and the second is what to execute.
function getBodies(fnName, items) {
  const bodies = [];
  let body;

  items.forEach((item, index) => {
    // pattern
    if (index % 2 === 0) {
      const pattern = item.items.slice(1);
      if (item.items[0].text !== fnName) return die(item, 'All patterns must use the same function name.');
      body = {pattern: pattern, allArgsIdentifiers: allArgsIdentifiers(pattern), action: null};

    // result
    } else {
      body.action = item;
      bodies.push(body);
    }
  })
  return bodies;
}

function getVars(patterns) {
  const args = [];
  patterns.forEach((pattern, index) => {
    if (pattern.type === 'Identifier' && pattern.text !== '_') {
      args.push({name: pattern.compile(), index: "[" + index + "]" });
    }
    if (pattern.type === 'Arr' && pattern.items.length === 1 && pattern.items[0].text.indexOf('|') >= 0) {
      const pieces = pattern.items[0].text.split('|');
      args.push({name: pieces[0], index: "[" + index + "][0]" });
      args.push({name: pieces[1], index: "[" + index + "].slice(1)" });
    }
  });
  return args;
}

function compilePolymorph(bodies) {
  return 'function () {\n'
       + 'const args_ = Array.prototype.slice.call(arguments || []);\n'
       + bodies.map(body => {

           let qualifier = null;

           const params = "[" + body.pattern.map(param => {
             if (param.type === 'List' && param.items[0].text === 'where') {
               qualifier = param.items[1];
               return '';
             }
             return '{type:"' + param.type + '", value: "' + param.compile().replace(/(\'|\"|\`)/g, "\\$1") + '" }';
           }).join(', ').replace(/, $/, '') + "]";

           const vars = getVars(body.pattern);
           const compiledVars = vars.map(varObj => {
             return `var ${varObj.name} = args_${varObj.index}`;
           }).join(';\n') + ';\n';

           let actions = [body.action];
           if (body.action.type === 'List' && body.action.items[0].text === 'do') {
             actions = body.action.items.slice(1);
           }

           return `if (MAPLE_.match_(args_, ${params})) {\n`
                +  (vars.length ? compiledVars : '')
                +  (!qualifier ? '' : 'if (' + qualifier.compile() + ') {\n')
                +  actions.map((action, index) => {
                     return (index === actions.length - 1 ? 'return ' : '') + action.compile();
                   }).join(';\n') + ';\n'
                +  (!qualifier ? '' : '}\n')
                + '}';

         }).join('\n')
       + " throw new Error('Could not find an argument match.');\n"
       + '}';
}

function compileAssignment(items) {
  if (items.length < 2) die(this, 'No unbound variables allowed.');

  // The pattern (make (foo x y) ...) denotes a named function.
  if (items[0].type === 'List') {
    const name = items[0].items[0].text;
    const bodies = getBodies(name, items);

    // not a polymorph
    if (bodies.length === 1 && bodies[0].allArgsIdentifiers) {
      const body = bodies[0];
      let actions;

      // No need to wrap `do` in a function in this case.
      if (body.action.type === 'List' && body.action.items[0].text === 'do') {
        actions = body.action.items.slice(1);
      } else {
        actions = [body.action];
      }

      return `
        const ${items[0].items[0].compile()} = function (${body.pattern.map(arg => arg.compile()).join(', ')}) {
          ${actions.map((action, index) => {
            return (index === actions.length - 1 ? 'return ' : '' ) + action.compile();
          }).join(';\n')};
        }
      `.trim();

    // polymorph!
    } else {
      return "const " + items[0].items[0].compile() + " = " + compilePolymorph(bodies);
    }

  // Not a named function
  } else {
    return "const " + items[0].compile() + " = " + items[1].compile();
  }

}

export default compileAssignment;
