import { compile, nodes } from '../utils';

/*
 * Translate objects 1-1.
 */
compile(nodes.ObjNode, function () {
  return `{ ${this.items.map((item, index) => {
    if (index % 2 === 0) { // key
      const atom = item.type === 'Atom';
      return (atom ? '[' : '"') + item.compile(true) + (atom ? ']' : '"') + ':';
    } else { // value
      return item.compile(true) + (index === this.length - 1 ? '' : ',');
    }
  }).join(' ')} }`;
});
