import { compile, nodes } from '../utils';

/*
 * Translate objects 1-1.
 */
compile(nodes.ObjNode, function () {
  return `{ ${this.items.map((item, index) => {
    if (index % 2 === 0) { // key
      const symbol = item.type === 'Symbol';
      return (symbol ? '[' : '"') + item.compile(true) + (symbol ? ']' : '"') + ':';
    } else { // value
      return item.compile(true) + (index === this.length - 1 ? '' : ',');
    }
  }).join(' ')} }`;
});
