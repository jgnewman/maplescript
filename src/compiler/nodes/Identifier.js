import { compile, nodes, die, getExposedFns, getMsgPassingFns } from '../utils';

function stripQ(word) {
  return word.replace(/\?$/, '');
}

function maybeQ(word) {
  return /\?$/.test(word) ? "?" : "";
}

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

function unconfidentLookup(precompiled) {
  /* foo?.bar?.baz ->
  (function(){
    var ref = typeof foo !== 'undefined' ? foo : undefined;
    if (ref) {
      return (function(){
        ref = ref["bar"];
        if (ref) {
          return (function(){
            ref = ref["baz"];
            return ref;
          }())
        } else { return }
      }())
    } else { return }
  }())
  */
  const pieces = precompiled.split('?');

  function recur(pieces, index) {
    index = index || 0;

    // catchall end
    if (!pieces.length) {
      return `ref_`;
    }

    const piece = pieces[0];

    const ref = (index === 0 && piece.indexOf('[') === -1)
                  ? `typeof ${piece} !== "undefined" ? ${piece} : undefined`
                  : `${index === 0 ? '' : 'ref_'}${piece}`;

    const isLastPiece = (piece && pieces.length === 1) ||
                        (piece && pieces.length === 2 && !pieces[1]);

    if (isLastPiece) {
      return `(function(){
        ${index === 0 ? "var " : ""}ref_ = ${ref};
        return ref_;
      }())`;
    }

    // average case
    return `(function(){
      ${index === 0 ? "var " : ""}ref_ = ${ref};
      if (ref_) {
        return ${recur(pieces.slice(1), index + 1)};
      } else { return }
    }())`;

  }

  return recur(pieces);

}

/*
 * Drop in identifiers.
 */
compile(nodes.IdentifierNode, function () {
  let word = this.text;

  if (isBif(stripQ(word))) {
    word = 'PINE_.' + word;

  } else if (/\.|\:/.test(word)) {
    const lookupChain = splitter(word);
    word = lookupChain.map(node => {
      if (node.type === ':') {
        return `[Symbol.for("${stripQ(node.piece)}")]` + maybeQ(node.piece);
      }
      if (node.type === '.') {
        const cleanPiece = stripQ(node.piece);
        return (/^\d+$/.test(cleanPiece) ? `[${cleanPiece}]` : `["${cleanPiece}"]`) + maybeQ(node.piece);
      }
      return node.piece;
    }).join('');
  }

  if (/\?/.test(word)) {
    word = unconfidentLookup(word);
  }

  return word;

});
