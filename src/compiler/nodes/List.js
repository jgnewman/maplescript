import { compile, nodes, getSpecialForms, getOperatorForms, die } from '../utils';
import compileOperator from './lists/operator';
import compileContextChain from './lists/context-chain';
import compileCondition from './lists/condition';
import compileDoBlock from './lists/immediate-block';
import compileHtmlDefinition from './lists/html';
import compileImport from './lists/import';
import compileExport from './lists/export';
import compileAwait from './lists/await';
import compileFunction from './lists/function';
import compileAssignment from './lists/assignment';
import compileDestructure from './lists/destructure';

function compileTail(arr) {
  return arr.map(item => item.compile(true)).join(', ');
}

function compileSpecial(form, items) {
  switch (form) {
    case '->': return compileContextChain.call(this, items);
    case 'all': return compileOperator.call(this, '&&', items);
    case 'any': return compileOperator.call(this, '||', items);
    case 'async': return compileFunction.call(this, items, true);
    case 'await': return compileAwait.call(this, items);
    case 'destr': return compileDestructure.call(this, items);
    case 'do': return compileDoBlock.call(this, items);
    case 'element': return compileHtmlDefinition.call(this, items);
    case 'export': return compileExport.call(this, items);
    case 'fn': return compileFunction.call(this, items);
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

  const head = this.items[0];
  const tail = this.items.slice(1);

  const operatorForms = getOperatorForms();
  const specialForms = getSpecialForms();

  // Translate things like (+ 1 2 3) into (1 + 2 + 3)
  if (operatorForms.indexOf(head.text) >= 0) {
    return compileOperator(head.text, tail);
  }

  const compiledHead = head.compile(true);

  // Translate things like (allof 1 2 3) into (1 && 2 && 3)
  // Also things like (if a 1 2) into (function() { if (a) { return 1 } else { return 2 }})()
  if (specialForms.indexOf(compiledHead) >= 0) {
    return compileSpecial.call(this, compiledHead, tail);
  }

  // Translate normal function calls
  return compiledHead + "(" + compileTail(tail) + ")";
});
