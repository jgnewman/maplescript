import { compile, nodes, die, getExposedFns, getMsgPassingFns } from '../utils';

function isBif(word) {
  return getExposedFns().indexOf(word) > -1;
}

function splitter(word) {
  const out = [];
  let accum = {type: null, piece: ''};
  for (let i = 0; i < word.length; i += 1) {
    if (word[i] === '.' || word[i] === ':') {
      out.push(accum);
      accum = {type: word[i], piece: ''};
    } else {
      accum.piece += word[i];
    }
  }
  out.push(accum);
  return out;
}

/*
 * Drop in identifiers.
 */
compile(nodes.IdentifierNode, function () {
  let word = this.text;

  if (isBif(word)) {
    return 'PINE_.' + word;
  }

  if (/\.|\:/.test(word)) {
    const lookupChain = splitter(word);
    return lookupChain.map(node => {
      if (node.type === ':') {
        return "[Symbol.for('" + node.piece + "')]"
      }
      if (node.type === '.') {
        return /^\d+$/.test(node.piece) ? ("[" + node.piece + "]") : ("." + node.piece);
      }
      return node.piece;
    }).join('');
  }

  return word;

});
