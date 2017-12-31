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

  [s_("bind")]: function (fn, ctx) {
    return fn.bind(ctx);
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
