/*
 * Pine Language Function Library
 */

var PINE_ = {

  /* Private functions */

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

    var SYMREPLACE = /^Symbol\.for\(\'|\'\)$/g;

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
        case 'Atom': return arg === Symbol.for(value.replace(SYMREPLACE, ''));
        case 'String': return arg === value;
        case 'Number': return arg === parseFloat(value);

        // Matching against an array is going to MEAN destructuring.
        // So we fail if the arg isn't an array or if it has more than 1 item.
        // Then we match for an empty array, or we pass.
        case 'Arr':
          if (!Array.isArray(arg) || value.match(/,/)) return false;
          if (value === "[]") return arg.length === 0;
          return true;

        default: PINE_.die('Can not pattern match against type ' + type);
      }
      // return (matches = false);
    });
    return matches;
  },

  /* Public functions */

  apply: function (fn, list, ctx) {
    return fn.apply(ctx || null, list);
  },

  create: function(cls) {
    return new (Function.prototype.bind.apply(cls, arguments));
  },

  createElement: function (type, attrs, body) {
    var a = attrs || {};
    var b = body  || [];

    // Die if we're not in a browser environment.
    if (typeof document === 'undefined') {
      return PINE_.die('No HTML document is available.');
    }

    // Create an element and set attributes.
    var elem = document.createElement(type);
    Object.keys(a).forEach(function (key) {
      var strKey = typeof key === 'symbol' ? Symbol.keyFor(key) : key;
      return elem.setAttribute(strKey.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), a[key]);
    });

    // Append children.
    b.forEach(function (node) {
      elem.appendChild(node);
    });
    return elem;
  },

  dangerouslyMutate: function (keyOrIndex, val, collection) {
    collection[keyOrIndex] = val;
    return collection;
  },

  dataType: function (val) {
    var type = typeof val;
    switch (type) {
      case 'symbol': return 'atom';
      case 'number': return isNaN(val) ? 'nan' : type;
      case 'object':
        if (val === null) return 'null';
        if (Array.isArray(val)) return 'array';
        if (val instanceof Date) return 'date';
        if (val instanceof RegExp) return 'regexp';
        if (typeof HTMLElement !== 'undefined' && val instanceof HTMLElement) return 'htmlelement';
        if ( (typeof Worker !== 'undefined' && val instanceof Worker) ||
             (val.constructor.name === 'ChildProcess' && typeof val.pid === 'number') ) return 'process';
        return type;
      default: return type;
    }
  },

  die: function (msg) {
    throw new Error(msg);
  },

  dom: function (selector) {
    return document.querySelector(selector);
  },

  domArray: function (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  },

  eql: function (a, b) {
    if (a === PINE_ || b === PINE_) return true; // <- Hack to force a match
    if (a === b || (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
      if (Array.isArray(a)) return a.every(function(item, index) { return PINE_.eql(item, b[index]) }.bind(this));
      const ks = Object.keys, ak = ks(a), bk = ks(b);
      if (!PINE_.eql(ak, bk)) return false;
      return ak.every(function (key) { return PINE_.eql(a[key], b[key]) }.bind(this));
    }
    return false;
  },

  get: function (collection, identifier) {
    return collection[identifier];
  },

  gt: function (x, y) {
    return x > y;
  },

  gte: function (x, y) {
    return x >= y;
  },

  head: function (list) {
    return list[0];
  },

  instanceof: function (val, type) {
    return val instanceof type;
  },

  last: function (list) {
    return list[list.length - 1];
  },

  lead: function (list) {
    return list.slice(0, list.length - 1);
  },

  log: function () {
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      return console.log.apply(console, arguments);
    }
  },

  lt: function (x, y) {
    return x < y;
  },

  lte: function (x, y) {
    return x <= y;
  },

  noop: function(){},

  not: function (val) {
    return !val;
  },

  random: function (list) {
    return list[Math.floor(Math.random()*list.length)];
  },

  range: function (from, through) {
    const out = [];
    for (var i = from; i <= through; i += 1) out.push(i);
    return out;
  },

  remove: function (keyOrIndex, collection) {
    PINE_.isReserved_(keyOrIndex);
    if (Array.isArray(collection)) {
      var splicer = collection.slice();
      splicer.splice(keyOrIndex, 1);
      return splicer;
    } else {
      var newObj = {};
      var keys = Object.keys(collection).concat(
        Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(collection) : []
      );
      keys.forEach(function (key) {
        keyOrIndex !== key && (newObj[key] = collection[key]);
      });
      return newObj;
    }
  },

  tail: function (list) {
    const out = list.slice(1);
    if (CNS_.isTuple(list)) return CNS_.tuple(out);
    return out;
  },

  throw: function (err) {
    throw err;
  },

  update: function (keyOrIndex, val, collection) {
    PINE_.isReserved(keyOrIndex);
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
      return PINE_.assign_(collection, replacer);
    }
  },

  warn: function () {
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      return console.warn.apply(console, arguments);
    }
    return PINE_.log.apply(null, arguments);
  }


};

module.exports = PINE_;
