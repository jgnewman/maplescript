import { compile, nodes } from '../utils';

/*
 * Translate objects 1-1.
 */
compile(nodes.ObjNode, function () {
  return `{ ${this.items.map((item, index) => {

    if (index % 2 === 0) { // key
      const isSymbol = item.type === 'Symbol';
      const isString = item.type === 'String';
      const compiled = item.compile();

      if (isSymbol) {
        return '[' + compiled + ']:';
      } else if (isString) {
        return compiled + ':';
      } else {
        return '"' + compiled + '":';
      }

    } else { // value
      return item.compile() + (index === this.length - 1 ? '' : ',');
    }

  }).join(' ')} }`;
});
