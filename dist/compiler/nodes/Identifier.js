'use strict';

var _utils = require('../utils');

function stripQ(word) {
  return word.replace(/\?$/, '');
}

function maybeQ(word) {
  return (/\?$/.test(word) ? "?" : ""
  );
}

function isBif(word) {
  return (0, _utils.getExposedFns)().indexOf(word) > -1;
}

function isReserved(word) {
  return (0, _utils.getReservedWords)().indexOf(word) > -1 && (0, _utils.getSpecialForms)().indexOf(word) === -1;
}

function isSystemPattern(word) {
  return (/[^_]_$/.test(word)
  );
}

function splitter(word) {
  var out = [];
  var accum = { type: null, piece: '' };
  for (var i = 0; i < word.length; i += 1) {
    if (word[i] === '.' || word[i] === ':') {
      out.push(accum);
      accum = { type: word[i], piece: '' };
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
          }).call(this)
        } else { return }
      }).call(this)
    } else { return }
  }).call(this)
  */
  var pieces = precompiled.split('?');

  function recur(pieces, index) {
    index = index || 0;

    // catchall end
    if (!pieces.length) {
      return 'ref_';
    }

    var piece = pieces[0];

    var ref = index === 0 && piece.indexOf('[') === -1 ? 'typeof ' + piece + ' !== "undefined" ? ' + piece + ' : undefined' : '' + (index === 0 ? '' : 'ref_') + piece;

    var isLastPiece = piece && pieces.length === 1 || piece && pieces.length === 2 && !pieces[1];

    if (isLastPiece) {
      return '(function(){\n        ' + (index === 0 ? "var " : "") + 'ref_ = ' + ref + ';\n        return ref_;\n      }).call(this)';
    }

    // average case
    return '(function(){\n      ' + (index === 0 ? "var " : "") + 'ref_ = ' + ref + ';\n      if (ref_) {\n        return ' + recur(pieces.slice(1), index + 1) + ';\n      } else { return }\n    }).call(this)';
  }

  return recur(pieces);
}

/*
 * Drop in identifiers.
 */
(0, _utils.compile)(_utils.nodes.IdentifierNode, function () {
  var word = this.text;

  if (word === '@') {
    word = 'this';
  } else {
    word = word.replace(/^\@(\:|\.)/, 'this$1').replace(/^\@/, 'this.');
  }

  var maybeReserved = word.replace(/(\?|\.|\:).*$/, '');

  if (isReserved(maybeReserved)) {
    return (0, _utils.die)(this, maybeReserved + ' is a reserved word in JavaScript and can\'t be used in this way.');
  }

  if (isSystemPattern(maybeReserved)) {
    return (0, _utils.die)(this, maybeReserved + ' follows the system\'s reserved pattern of suffixing an identifier with "_".');
  }

  if (isBif(stripQ(word))) {
    word = word.replace(/^\>\>\=/, 'callChain_');
    word = 'PINE_.' + word;
  } else if (/\.|\:/.test(word)) {
    var lookupChain = splitter(word);
    word = lookupChain.map(function (node) {
      if (node.type === ':') {
        return '[Symbol.for("' + stripQ(node.piece) + '")]' + maybeQ(node.piece);
      }
      if (node.type === '.') {
        var cleanPiece = stripQ(node.piece);
        return (/^\d+$/.test(cleanPiece) ? '[' + cleanPiece + ']' : '["' + cleanPiece + '"]') + maybeQ(node.piece);
      }
      return node.piece;
    }).join('');
  }

  if (/\?/.test(word)) {
    word = unconfidentLookup(word);
  }

  return word;
});