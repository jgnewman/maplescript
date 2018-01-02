import { compile, nodes, getSpecialForms, getOperatorForms, die } from '../utils';
import compileOperator from './lists/operator';
import compileContextChain from './lists/context-chain';
import compileCondition from './lists/condition';
import compileDoBlock from './lists/immediate-block';
import compileImport from './lists/import';
import compileExport from './lists/export';
import compileAwait from './lists/await';
import compileAssignment from './lists/assignment';
import compileDestructure from './lists/destructure';

function compileTail(arr) {
  return arr.map(item => item.compile(true)).join(', ');
}

// #(+ 1 2)
// #([x] (+ x x))
// #(async :channel [x] (+ x x))
function separateArgs(items) {
  let isAsync = false;
  let asyncChannel = null;

  if (items[0].text === '@async') {
    isAsync = true;
    asyncChannel = items[1];
    items = items.slice(2);
  } else {
    items = items.slice(1);
  }


  let args = [];
  if (items[0] && items[0].type === 'Arr') {
    args = args.concat(items[0].items);
    items = items.slice(1);
  }

  return {
    isAsync: isAsync,
    asyncChannel: asyncChannel,
    args: args,
    actions: items
  };
}

function compileFnBody() {
  const items = separateArgs(this.items);
  const isAsync = items.isAsync;
  let asyncChannel;

  if (items.isAsync) {
    asyncChannel = items.asyncChannel.compile(true);
  }

  return `
    ${isAsync ? 'async ' : ''}function (${items.args.map(arg => arg.compile(true)).join(', ')}) {
      ${isAsync ? 'try {': ''}
      ${items.actions.map((action, index) => {
        return index === items.actions.length - 1 ? 'return ' + action.compile(true) + ';' : action.compile(true);
      }).join(';\n')}
      ${isAsync ? '} catch (err_) { MAPLE_[Symbol.for("signal")](' + asyncChannel + ', err_); }': ''}
    }
  `.trim();
}

function compileSpecial(form, items) {
  switch (form) {
    case '->': return compileContextChain.call(this, items);
    case 'all': return compileOperator.call(this, '&&', items);
    case 'any': return compileOperator.call(this, '||', items);
    case 'await': return compileAwait.call(this, items);
    case 'destr': return compileDestructure.call(this, items);
    case 'do': return compileDoBlock.call(this, items);
    case 'export': return compileExport.call(this, items);
    case 'if': return compileCondition.call(this, items);
    case 'import': return compileImport.call(this, items);
    case 'make': return compileAssignment.call(this, items);
    case 'none': return compileOperator.call(this, '&& !', items, "true");
    case 'not': return compileOperator.call(this, '&& !', items, "true");
  }
}

/*
 * Create function calls and special forms
 */
compile(nodes.ListNode, function () {
  if (!this.items) die(this, 'Lists can not be empty.');

  // Compile simple functions like (@ [x] (foo x))
  if (/^\@(async)?$/.test(this.items[0].text)) return compileFnBody.call(this);

  const head = this.items[0];
  const tail = this.items.slice(1);

  const operatorForms = getOperatorForms();
  const specialForms = getSpecialForms();

  // Translate things like (+ 1 2 3) into (1 + 2 + 3)
  if (operatorForms.indexOf(head.text) >= 0) {
    return compileOperator(head.text, tail);
  }

  const compiledHead = head.compile(true);

  // Translate things like (all 1 2 3) into (1 && 2 && 3)
  // Also things like (if a 1 2) into (function() { if (a) { return 1 } else { return 2 }})()
  if (specialForms.indexOf(compiledHead) >= 0) {
    return compileSpecial.call(this, compiledHead, tail);
  }

  // Translate normal function calls
  return compiledHead + "(" + compileTail(tail) + ")";
});
