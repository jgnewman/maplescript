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

        default: MAPLE_.die('Can not pattern match against type ' + type);
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

  apply: function (fn, list, ctx) {
    return fn.apply(ctx || null, list);
  },

  attempt: function (channel, fun) {
    if (MAPLE_.dataType(channel) !== s_('symbol')) {
      throw new Error('Signal channels must be identified with symbols.');
    }
    try {
      return fun();
    } catch (err) {
      MAPLE_.signal(channel, err);
    }
  },

  dangerouslyMutate: function (keyOrIndex, val, collection) {
    collection[keyOrIndex] = val;
    return collection;
  },

  dataType: function (val) {
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
    if (a === MAPLE_ || b === MAPLE_) return true; // <- Hack to force a match
    if (a === b || (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
      if (Array.isArray(a)) return a.every(function(item, index) { return MAPLE_.eql(item, b[index]) }.bind(this));
      const ks = Object.keys, ak = ks(a), bk = ks(b);
      if (!MAPLE_.eql(ak, bk)) return false;
      return ak.every(function (key) { return MAPLE_.eql(a[key], b[key]) }.bind(this));
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

  handle: function (channel, fun) {
    if (MAPLE_.dataType(channel) !== s_('symbol')) {
      throw new Error('Signal channels must be identified with symbols.');
    }
    const handlers = MAPLE_.channels_[channel] = MAPLE_.channels_[channel] || [];
    handlers.push(fun);
  },

  head: function (list) {
    return list[0];
  },

  instance: function(cls) {
    return new (Function.prototype.bind.apply(cls, arguments));
  },

  instanceof: function (val, type) {
    return val instanceof type;
  },

  keys: function (object) {
    return Object.keys(object).concat(Object.getOwnPropertySymbols(object));
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

  merge: function () {
    var args = Array.prototype.slice.call(arguments || []);
    var type = MAPLE_.dataType(arguments[0]);
    var out;
    switch (type) {
      case s_('array'):
        out = [];
        args.forEach(function (arg) {
          arg.forEach(function (item) {
            out.push(item);
          });
        });
        return out;
      case s_('object'):
        out = {};
        args.forEach(function (arg) {
          MAPLE_.keys(arg).forEach(function (key) {
            out[key] = arg[key];
          });
        });
        return out;
      default: throw new Error('Can only merge objects or arrays.');
    }
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
    MAPLE_.isReserved_(keyOrIndex);
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

  signal: function (channel, message) {
    if (MAPLE_.dataType(channel) !== s_('symbol')) {
      throw new Error('Signal channels must be identified with symbols.');
    }
    const handlers = MAPLE_.channels_[channel];
    if (handlers && handlers.length) {
      handlers.forEach(handler => handler(message));
    }
  },

  tail: function (list) {
    return list.slice(1);
  },

  throw: function (err) {
    throw err;
  },

  unhandle: function (channel, fun) {
    const handlers = MAPLE_.channels_[channel];
    if (handlers) {
      handlers.splice(handlers.indexOf(fun), 1);
    }
  },

  update: function (keyOrIndex, val, collection) {
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

  vdom: {

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
        ? MAPLE_.vdom[s_('render')](renderedTree)
        : renderedTree;

      selector = typeof selector === 'string'
        ? MAPLE_.dom(selector)
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

  warn: function () {
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      return console.warn.apply(console, arguments);
    }
    return MAPLE_.log.apply(null, arguments);
  }


};

module.exports = MAPLE_;
