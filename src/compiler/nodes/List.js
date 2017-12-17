import { compile, nodes, getSpecialForms, getOperatorForms, die } from '../utils';

function compileOperator(op, items, prepend) {
  return "("
    + (prepend ? (prepend + ' ' + op + ' ') : '')
    + items.map(item => item.compile(true)).join(' ' + op + ' ')
    + ")";
}

function compileTail(arr) {
  return arr.map(item => item.compile(true)).join(',');
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
    + "\n}())";
}

function compileFunction(body) {
  if (body[0].type !== 'Arr') die(this, 'Function definitions must contain a parameters array.');

  const params = body[0].items.map(param => param.compile(true)).join(', ');

  const bodyActions = body.slice(1);
  const cleanBody = bodyActions.map((action, index) => {
    return (index === bodyActions.length - 1 ? "return " : "") + action.compile(true);
  }).join(';\n') + ';';

  return "function (" + params + ") {\n"+ cleanBody +"\n}";
}

function compileAssignment(items) {
  if (items.length < 2) die(this, 'No unbound variables allowed.');
  // Not a function
  if (items.length < 3) return "const " + items[0].compile(true) + " = " + items[1].compile(true);
  // Function
  return "const " + items[0].compile(true) + " = " + compileFunction(items.slice(1));
}

function compileBlock(items) {
  const body = items.map((action, index) => {
    return (index === items.length - 1 ? "return " : "") + action.compile(true);
  }).join(';\n') + ';';
  return "(function () {\n"+ body +"\n}())";
}

function compileSpecial(form, items) {
  switch (form) {
    case 'all': return compileOperator('&&', items);
    case 'any': return compileOperator('||', items);
    case 'do': return compileBlock(items);
    case 'fn': return compileFunction(items);
    case 'if': return compileCondition(items);
    case 'none': return compileOperator('&& !', items, "true");
    case 'sym': return compileAssignment(items);
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
    return compileSpecial(compiledHead, tail);
  }

  // Translate normal function calls
  return compiledHead + "(" + compileTail(tail) + ")";
});
