import { die } from '../../utils';
import compileFunction from './function';

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

export default compileAssignment;
