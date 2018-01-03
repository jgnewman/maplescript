(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MAPLE_ = m = require("maplescript/library");

const highlight = require('custom-syntax-highlighter');
const patterns = require('./highlight-patterns');
const dedentBlocks = function () {
          return m[Symbol.for("map")](m[Symbol.for("domArray")]('pre code'), function (block) {
      
      const newText = (function(){
    var ref_ = this;
    (function(){ ref_ = block["innerText"]["split"](/\n/g) }).call(ref_);
(function(){ ref_ = m[Symbol.for("map")](this, function (line) {
      
      return line["replace"](/^\s{8}/, '');
      
    }) }).call(ref_);
(function(){ ref_ = this["join"]('\n') }).call(ref_);
    return ref_;
  }).call(this);
return m[Symbol.for("dangerouslyMutate")]('innerHTML', newText, block);
      
    });
        };
dedentBlocks();
highlight({ "patterns": function (block) {
      
      return (function(){
if ((block["className"]["indexOf"]('maplescript') >= 0)) {
return patterns[Symbol.for("maplePatterns")]()
} else if ((block["className"]["indexOf"]('javascript') >= 0)) {
return patterns[Symbol.for("jsPatterns")]()
} else {
return []
}
}).call(this);
      
    }, "postProcess": function (text) {
      
      return text["replace"](/(\&)([^\#])/g, '<span class="keyword ref">$1</span>$2');
      
    } });
const buildNode = function (type, id, text) {
          const cleanText = text["replace"](/\(([^\s]+)(\s+[^\s]+)*\)/, '$1');
return m[Symbol.for("vdom")][Symbol.for("render")](MAPLE_[Symbol.for("vdom")][Symbol.for("create")]("a", { [Symbol.for("href")]: ("#" + (id)), [Symbol.for("class")]: type["toLowerCase"]() }, [
cleanText
]));
        };
const buildNav = function () {
const args_ = Array.prototype.slice.call(arguments || []);
if (MAPLE_.match_(args_, [])) {
return buildNav(m[Symbol.for("domArray")]('h1, h2, h3, h4, h5, h6'), m[Symbol.for("dom")]('#js-nav'));
}
if (MAPLE_.match_(args_, [{type:"Arr", value: "[]" }, {type:"Identifier", value: "nav" }])) {
var nav = args_[1];
return nav;
}
if (MAPLE_.match_(args_, [{type:"Arr", value: "[title|rest]" }, {type:"Identifier", value: "nav" }])) {
var title = args_[0][0];
var rest = args_[0].slice(1);
var nav = args_[1];
const node = buildNode(title["nodeName"], title["getAttribute"]('id'), title["innerText"]);
nav["appendChild"](node);
return setTimeout(function () {
      
      node["setAttribute"]('class', ("show " + (node["getAttribute"]('class'))));
return buildNav(rest, nav);
      
    }, 10);
} throw new Error('Could not find an argument match.');
};
buildNav();

},{"./highlight-patterns":2,"custom-syntax-highlighter":5,"maplescript/library":11}],2:[function(require,module,exports){
var MAPLE_ = m = require("maplescript/library");

const maplePatterns = function () {
          return [{ "name": 'comment multi', "match": /^(\-\-\-(.|\r|\n)*?\-\-\-)/ }, { "name": 'comment single', "match": /^((\-\-|\/\/)[^\r\n]+)/ }, { "name": 'comment arrow', "match": /^((\=\>|\/\/)[^\r\n]+)/ }, { "name": 'string single', "match": /^(\'[^\'\n]*\')/ }, { "name": 'string double', "match": /^(\"[^\'\n]*\")/ }, { "name": 'string tick', "match": /^(\`[^\'\n]*\`)/ }, { "name": 'number', "match": /^(\d+(\.\d+)?)/ }, { "name": 'symbol', "match": [/^ (\:[A-Za-z0-9_\-\$]+)/, ' '] }, { "name": 'keyword sym', "match": /^(\:\:|\@)/ }, { "name": 'keyword ref', "match": /^(async|await|const|do|from|if|import|make|NaN|null|of|return|undefined)\b/ }, { "name": 'keyword call', "match": [/^\((=\>\>|\-\>|\@|async|await|do|export|if|import|make|where)\b/, '(', ''] }, { "name": 'keyword call sym', "match": [/^\((\-\>)\s/, '(', ' '] }, { "name": 'normal call', "match": [/^\(([^\s\,\(\)\;\@]+)/, '('] }, { "name": 'html close', "match": [/^\<\\\/([A-Za-z0-9\-]+)/, '<&#47;'] }, { "name": 'html open', "match": [/^\<\\([A-Za-z0-9\-]+)/, '<'] }];
        };
const jsPatterns = function () {
          return [{ "name": 'comment multi', "match": /^(\/\*(.|\r|\n)*?\*\/)/ }, { "name": 'comment single', "match": /^(\/\/[^\r\n]+)/ }, { "name": 'string single', "match": /^(\'[^\'\n]*\')/ }, { "name": 'string double', "match": /^(\"[^\'\n]*\")/ }, { "name": 'string tick', "match": /^(\`[^\'\n]*\`)/ }, { "name": 'string key', "match": /^([A-Za-z0-9\&_]+\:)/ }, { "name": 'number', "match": /^(\d+(\.\d+)?)/ }, { "name": 'regex', "match": /^(\/.+\/[gim]*)/ }, { "name": 'keyword ref', "match": /^\b(async|await|const|do|from|if|import|make|NaN|null|of|return|throw|undefined)\b/ }, { "name": 'keyword sym', "match": /^(\=\>|\=)/ }, { "name": 'normal call', "match": [/^([A-Za-z0-9\&_]+)\(/, '', '('] }];
        };
module.exports = {[Symbol.for("maplePatterns")]: MAPLE_.aritize_(maplePatterns, 0), [Symbol.for("jsPatterns")]: MAPLE_.aritize_(jsPatterns, 0)};

},{"maplescript/library":11}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

/**
 * Recursively parses a string of text in a way that loosely mimicks a Jison parser.
 * It looks at the beginning of the string, and attempts to find a match. If there
 * is no match, it collects a raw character and recurses. If it finds a match, it
 * collects the match, wraps it in a span with a class name, and recurses. It
 * goes until the whole string has been collected.
 *
 * @param  {Object} patterns  The array of pattern objects to parse against
 * @param  {String} incoming  The original text, being shortened as we recurse.
 * @param  {String} output    The new text with spans.
 *
 * @return {String} The output.
 */
function parse(patterns, incoming, output) {

  /*
   * These variables will be used to help us figure out how to
   * wrap text when we find a match.
   */
  var match = null;
  var matchType = null;
  var matchPrefix = null;
  var matchSuffix = null;
  output = output || '';

  /*
   * Return the output when the incoming string has nothing left in it.
   */
  if (!incoming.length) return output || '';

  /*
   * Check each pattern against the string. If we find a match, assign it to the
   * match variable.
   */
  patterns.some(function (pattern) {
    var name = pattern.name;
    var isRegex = pattern.match instanceof RegExp;
    var capture = isRegex ? pattern.match : pattern.match[0];
    var prefix = isRegex ? null : pattern.match[1] || null;
    var suffix = isRegex ? null : pattern.match[2] || null;

    match = incoming.match(capture);
    matchType = match ? pattern.name : null;
    matchPrefix = prefix;
    matchSuffix = suffix;
    return !!match;
  });

  /*
   * If there was no match, collect one character and recurse.
   */
  if (!match) {
    return parse(patterns, incoming.slice(1), output + incoming[0]);

    /*
     * If there was a match, wrap it in a span. If we have a prefix and/or
     * suffix, drop those in too.
     */
  } else {
    var replacement = '<span class="' + matchType + '">' + match[1] + '</span>';
    if (matchPrefix) replacement = matchPrefix + replacement;
    if (matchSuffix) replacement = replacement + matchSuffix;

    /*
     * Collect the match and recurse
     */
    return parse(patterns, incoming.slice(match[0].length), output + replacement);
  }
}

/**
 * Custom-syntax-highlighter is nice and knows that you like to indent code
 * when you're writing. It doesn't expect you to dedent your `pre` and `code`
 * tags all the way to the left just so it won't appear weirdly indented in the
 * output.
 *
 * This function does some convenient whitespace parsing to help with things like that.
 *
 * @param  {String} text  The original, unparsed text.
 *
 * @return {String} The cleaned up text.
 */
function clean(text) {

  /*
   * Cut out useless new line lines at the front and back.
   * Check to see if there's some indentation and return if not.
   */
  var trimmed = text.replace(/^\n+|\n+\s+$/g, '');
  var spaceToCut = trimmed.match(/^\s+/);
  if (!spaceToCut) return trimmed;

  /*
   * Split the block into an array of lines. For each one, remove the
   * matched indentation from the front.
   */
  var textArray = trimmed.split('\n');
  var dedented = textArray.map(function (string, index) {
    return !string || /^\s+$/.test(string) ? string : string.replace(spaceToCut[0], '');
  }).join('\n');

  /*
   * Spit out the dedented text.
   */
  return '\n' + dedented;
}

/**
 * Highlights code blocks in a way you specify.
 *
 * @param  {Object} config    Allows the following keys:
 *                              patterns:    [...] (The regex patterns used to parse)
 *                              linenums:    true  (Turns on line numbers)
 *                              selector:    'pre' (Defaults to 'pre code')
 *                              preProcess:  fn    (Allows you to eff with the string after parsing)
 *                              postProcess: fn    (Allows you to eff with the string after parsing)
 *
 * @return {undefined}
 */
function highlight(config) {
  var selector = config.selector || 'pre code';
  var postProcess = config.postProcess || function (str) {
    return str;
  };
  var preProcess = config.preProcess || function (str) {
    return str;
  };

  /*
   * Find all `pre code` blocks and loop over them. For each block...
   */
  Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (block) {
    var patterns = (typeof config.patterns === 'function' ? config.patterns(block) : config.patterns) || {};

    /*
     * Get the inner text, clean the text, then parse the text with the patterns.
     */
    var innerText = block.innerText;
    var cleanText = clean(innerText);
    var parsed = postProcess(parse(patterns, preProcess(cleanText)));

    /*
     * If the user wants line numbers, split the parsed text on new lines
     * and loop over each line.
     */
    if (config.linenums) {
      parsed = parsed.split('\n').map(function (string, index) {

        /*
         * Create a line number like 00, 01, 02, etc...
         */
        if (!index) return string;
        var ind = index - 1 + '';
        if (ind.length < 2) ind = '0' + ind;

        /*
         * Return a new span on the beginning og the line.
         */
        return '<span class="linenum">' + ind + '</span> ' + string;
      }).join('\n');
    }
    block.innerHTML = parsed;
  });
}

/*
 * Export the hightlight function
 */
module.exports = exports = highlight;
},{}],6:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":9}],7:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":3}],8:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":8}],10:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],11:[function(require,module,exports){
/*
 * Maple Language Function Library
 */

function s_(val) {
  return Symbol.for(val);
}

var MAPLE_ = {

  /* Dependencies */

  vmanip_: {
    Vnode: require('virtual-dom/vnode/vnode'),
    h: require('virtual-dom/h'),
    diff: require('virtual-dom/diff'),
    patch: require('virtual-dom/patch'),
    renderPhysical: require('virtual-dom/create-element')
  },

  /* Private functions */

  // This is where we'll store all event channels.
  channels_: {},

  aritize_: function (fn, arity) {
    return function () {
      var args = Array.prototype.slice.call(arguments || []);
      if (args.length !== arity) {
        throw new Error('Wrong number of arguments passed to ' + (fn.name || 'anonymous') + ' function.');
      }
      return fn.apply(null, args);
    }
  },

  args_: function (args) {
    const out = [];
    Array.prototype.push.apply(out, args);
    return out;
  },

  assign_: function (base, toAdd) {
    if (typeof Object.assign !== 'function') {
      var out = {};
      Object.keys(base).forEach(function (key) { out[key] = base[key] });
      Object.keys(toAdd).forEach(function (key) { out[key] = toAdd[key] });
      if (typeof Object.getOwnPropertySymbols === 'function') {
        Object.getOwnPropertySymbols(base).forEach(function (sym) { out[sym] = base[sym] });
        Object.getOwnPropertySymbols(toAdd).forEach(function (sym) { out[sym] = toAdd[sym] });
      }
      return out;
    }
    return Object.assign({}, base, toAdd);
  },

  callChain_: function () {
    var starter = arguments[0];
    var lists = Array.prototype.slice.call(arguments || [], 1);
    var output = starter;
    lists.forEach(function (list) {
      output = output.apply(null, list);
    });
    return output;
  },

  isReserved_: function (val) {
    if (
      typeof val === 'string'   &&
      val.length > 1            &&
      val[val.length-1] === '_' &&
      val[val.length-2] !== '_' // Let it through if it ends with "__"
    ) {
      throw new Error('Value ' + val + ' matches a reserved system pattern.');
    }
    return false;
  },

  match_: function (args, descriptors) {
    if (args.length !== descriptors.length) return false;
    if (!args.length && !descriptors.length) return true;

    var SYMREPLACE = /^Symbol\.for\((\'|\"|\`)|((\'|\"|\`))\)$/g;

    function convertSpecial(special) {
      switch (special) {
        case 'null': return null;
        case 'undefined': return undefined;
        case 'true': return true;
        case 'false': return false;
        default: return special;
      }
    }

    function isSpecial(ident) {
      return ident === 'null' || ident === 'undefined' || ident === 'true' || ident === 'false';
    }

    return args.every((arg, index) => {
      var desc = descriptors[index];
      var type = desc.type;
      var value = desc.value;

      switch (type) {
        case 'Identifier': return isSpecial(value) ? arg === convertSpecial(value) : true;
        case 'String': return arg === value;
        case 'Number': return arg === parseFloat(value);
        case 'Symbol': return typeof arg === 'symbol' && Symbol.keyFor(arg) === value.replace(SYMREPLACE, '');

        // Matching against an array is going to MEAN destructuring.
        // So we fail if the arg isn't an array or if it has more than 1 item.
        // Then we match for an empty array, or we pass.
        case 'Arr':
          if (!Array.isArray(arg) || value.match(/,/)) return false;
          if (value === "[]") return arg.length === 0;
          return true;

        default: MAPLE_[s_("die")]('Can not pattern match against type ' + type);
      }
      // return (matches = false);
    });
    return matches;
  },

  // Attrs should all be symbols and should match real attr names exactly.
  // No fancy camel casing or anything like that.
  mapAttrsToVirtualAttrs_: function (attrs) {
    var out = {
      flat: {},
      nested: { attributes: {} }
    };
    attrs && Object.getOwnPropertySymbols(attrs).forEach(function (key) {
      var value = attrs[key];
      var strKey = Symbol.keyFor(key);
      out.flat[key] = value;
      if (typeof value === 'function') {
        out.nested[strKey] = value;
      } else {
        out.nested.attributes[strKey] = value;
      }
    });
    return out;
  },

  /* Public functions */

  [s_("apply")]: function (fn, list, ctx) {
    return fn.apply(ctx || null, list);
  },

  [s_("attempt")]: function (channel, fun) {
    if (MAPLE_[s_("typeof")](channel) !== s_('symbol')) {
      throw new Error('Signal channels must be identified with symbols.');
    }
    try {
      return fun();
    } catch (err) {
      MAPLE_[s_("signal")](channel, err);
    }
  },

  [s_("copy")]: function (collection) {
    var type = MAPLE_[s_("typeof")](collection);
    if (type !== s_('object') && type !== s_('array')) {
      return collection;
    }
    if (type === s_('array')) {
      var copy = [];
      collection.forEach(function (item) {
        var toPush = typeof item === 'object' ? MAPLE_[s_("copy")](item) : item;
        copy.push(toPush);
      });
      return copy;
    } else {
      var copy = {};
      MAPLE_[s_("keys")](collection).forEach(function (key) {
        var val = collection[key];
        var toAdd = typeof val === 'object' ? MAPLE_[s_("copy")](val) : val;
        copy[key] = toAdd;
      });
      return copy;
    }
  },

  [s_("dangerouslyMutate")]: function (keyOrIndex, val, collection) {
    collection[keyOrIndex] = val;
    return collection;
  },

  [s_("die")]: function (msg) {
    throw new Error(msg);
  },

  [s_("dom")]: function (selector) {
    return document.querySelector(selector);
  },

  [s_("domArray")]: function (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  },

  [s_("eql")]: function (a, b) {
    if (a === MAPLE_ || b === MAPLE_) return true; // <- Hack to force a match
    if (a === b || (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
      if (Array.isArray(a)) return a.every(function(item, index) { return MAPLE_[s_("eql")](item, b[index]) }.bind(this));
      const ks = Object.keys, ak = ks(a), bk = ks(b);
      if (!MAPLE_[s_("eql")](ak, bk)) return false;
      return ak.every(function (key) { return MAPLE_[s_("eql")](a[key], b[key]) }.bind(this));
    }
    return false;
  },

  [s_("get")]: function (collection, identifier) {
    return collection[identifier];
  },

  [s_("handle")]: function (channel, fun) {
    if (MAPLE_[s_("typeof")](channel) !== s_('symbol')) {
      throw new Error('Signal channels must be identified with symbols.');
    }
    const handlers = MAPLE_.channels_[channel] = MAPLE_.channels_[channel] || [];
    handlers.push(fun);
    return fun;
  },

  [s_("head")]: function (list) {
    return list[0];
  },

  [s_("instanceof")]: function (val, type) {
    return val instanceof type;
  },

  [s_("keys")]: function (object) {
    return Object.keys(object).concat(Object.getOwnPropertySymbols(object));
  },

  [s_("last")]: function (list) {
    return list[list.length - 1];
  },

  [s_("lead")]: function (list) {
    return list.slice(0, list.length - 1);
  },

  [s_("log")]: function () {
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      return console.log.apply(console, arguments);
    }
  },

  [s_("map")]: function (collection, action) {
    if (Array.isArray(collection)) return collection.map(action);
    var newObj = {};
    MAPLE_[s_("keys")](collection).forEach(function (key) {
      newObj[key] = action(collection[key], key);
    });
    return newObj;
  },

  [s_("merge")]: function () {
    var args = Array.prototype.slice.call(arguments || []);
    var type = MAPLE_[s_("typeof")](arguments[0]);
    var out;
    switch (type) {
      case s_('array'):
        out = [];
        args.forEach(function (arg) {
          out = out.concat(arg);
        });
        return out;
      case s_('object'):
        out = {};
        args.forEach(function (arg) {
          MAPLE_[s_("keys")](arg).forEach(function (key) {
            out[key] = arg[key];
          });
        });
        return out;
      default: throw new Error('Can only merge objects or arrays.');
    }
  },

  [s_("new")]: function(cls) {
    return new (Function.prototype.bind.apply(cls, arguments));
  },

  [s_("noop")]: function(){},

  [s_("random")]: function (list) {
    return list[Math.floor(Math.random()*list.length)];
  },

  [s_("range")]: function (from, through) {
    const out = [];
    for (var i = from; i <= through; i += 1) out.push(i);
    return out;
  },

  [s_("remove")]: function (collection, keyOrIndex) {
    MAPLE_.isReserved_(keyOrIndex);
    if (Array.isArray(collection)) {
      var splicer = collection.slice();
      splicer.splice(keyOrIndex, 1);
      return splicer;
    } else {
      var newObj = {};
      var keys = MAPLE_[s_('keys')](collection);
      keys.forEach(function (key) {
        keyOrIndex !== key && (newObj[key] = collection[key]);
      });
      return newObj;
    }
  },

  [s_("signal")]: function (channel, message) {
    if (MAPLE_[s_("typeof")](channel) !== s_('symbol')) {
      throw new Error('Signal channels must be identified with symbols.');
    }
    const handlers = MAPLE_.channels_[channel];
    if (handlers && handlers.length) {
      handlers.forEach(handler => handler(message));
    }
  },

  [s_("tail")]: function (list) {
    return list.slice(1);
  },

  [s_("throw")]: function (err) {
    throw err;
  },

  [s_("typeof")]: function (val) {
    var type = typeof val;
    switch (type) {
      case 'symbol': return s_('symbol');
      case 'number': return isNaN(val) ? s_('nan') : s_(type);
      case 'object':
        if (val === null) return s_('null');
        if (Array.isArray(val)) return s_('array');
        if (val instanceof MAPLE_.vmanip_.Vnode) return s_('vnode');
        if (val instanceof Date) return s_('date');
        if (val instanceof RegExp) return s_('regexp');
        if (typeof HTMLElement !== 'undefined' && val instanceof HTMLElement) return s_('htmlelement');
        if ( (typeof Worker !== 'undefined' && val instanceof Worker) ||
             (val.constructor.name === 'ChildProcess' && typeof val.pid === 'number') ) return s_('process');
        return s_(type);
      default: return s_(type);
    }
  },

  [s_("unhandle")]: function (channel, fun) {
    const handlers = MAPLE_.channels_[channel];
    if (handlers) {
      handlers.splice(handlers.indexOf(fun), 1);
    }
  },

  [s_("update")]: function (collection, keyOrIndex, val) {
    MAPLE_.isReserved_(keyOrIndex);
    if (Array.isArray(collection)) {
      var newSlice = collection.slice();
      newSlice[keyOrIndex] = val;
      return newSlice;
    } else if (typeof HTMLElement !== 'undefined' && collection instanceof HTMLElement) {
      const clone = collection.cloneNode();
      clone[keyOrIndex] = val;
      return clone;
    } else if (typeof collection === 'function') {
      // Updating a function allows breaking the functionalism rule only
      // because JavaScript makes it impossible to clone a function and account
      // for all necessary cases. This should be avoided where possible.
      collection[keyOrIndex] = val;
      return collection;
    } else {
      const replacer = {};
      replacer[keyOrIndex] = val;
      return MAPLE_.assign_(collection, replacer);
    }
  },

  [s_("vdom")]: {

    [s_('create')]: function (type, attrs, children) {
      var attributes = MAPLE_.mapAttrsToVirtualAttrs_(attrs);
      var childNodes = arguments.length === 3 ? children : [];
      if (!Array.isArray(childNodes)) {
        childNodes = [childNodes];
      }
      if (typeof type === 'function') {
        return type(attributes.flat, childNodes);
      }
      return MAPLE_.vmanip_.h(type, attributes.nested, childNodes || []);
    },

    [s_('diff')]: function (oldVirtualDOM, newVirtualDOM) {
      return MAPLE_.vmanip_.diff(oldVirtualDOM, newVirtualDOM);
    },

    [s_('injectNodes')]: function (renderedTree, selector) {

      renderedTree = renderedTree instanceof MAPLE_.vmanip_.Vnode
        ? MAPLE_[s_("vdom")][s_('render')](renderedTree)
        : renderedTree;

      selector = typeof selector === 'string'
        ? MAPLE_[s_("dom")](selector)
        : selector;

      selector.innerHTML = '';
      selector.appendChild(renderedTree);
      return renderedTree;
    },

    [s_('patchNodes')]: function (renderedTree, patches) {
      return MAPLE_.vmanip_.patch(renderedTree, patches);
    },

    [s_('render')]: function (virtualDOM) {
      return MAPLE_.vmanip_.renderPhysical(virtualDOM);
    }
  },

  [s_("warn")]: function () {
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      return console.warn.apply(console, arguments);
    }
    return MAPLE_[s_("log")].apply(null, arguments);
  }


};

module.exports = MAPLE_;

},{"virtual-dom/create-element":12,"virtual-dom/diff":13,"virtual-dom/h":14,"virtual-dom/patch":15,"virtual-dom/vnode/vnode":33}],12:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":17}],13:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":37}],14:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":24}],15:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":20}],16:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":28,"is-object":10}],17:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":26,"../vnode/is-vnode.js":29,"../vnode/is-vtext.js":30,"../vnode/is-widget.js":31,"./apply-properties":16,"global/document":7}],18:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],19:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":31,"../vnode/vpatch.js":34,"./apply-properties":16,"./update-widget":21}],20:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":17,"./dom-index":18,"./patch-op":19,"global/document":7,"x-is-array":38}],21:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":31}],22:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":6}],23:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":27,"../vnode/is-vhook":28,"../vnode/is-vnode":29,"../vnode/is-vtext":30,"../vnode/is-widget":31,"../vnode/vnode.js":33,"../vnode/vtext.js":35,"./hooks/ev-hook.js":22,"./hooks/soft-set-hook.js":23,"./parse-tag.js":25,"x-is-array":38}],25:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],26:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":27,"./is-vnode":29,"./is-vtext":30,"./is-widget":31}],27:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],28:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":32}],30:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":32}],31:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],32:[function(require,module,exports){
module.exports = "2"

},{}],33:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":27,"./is-vhook":28,"./is-vnode":29,"./is-widget":31,"./version":32}],34:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":32}],35:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":32}],36:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":28,"is-object":10}],37:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":26,"../vnode/is-thunk":27,"../vnode/is-vnode":29,"../vnode/is-vtext":30,"../vnode/is-widget":31,"../vnode/vpatch":34,"./diff-props":36,"x-is-array":38}],38:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}]},{},[1]);
