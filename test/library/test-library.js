import assert from 'assert';
import lib from  '../../library';

function noop() {}

function s(val) {
  return Symbol.for(val);
}

const mockDocument = {

  querySelector(arg) {
    if (arg === 'foo') {
      return true;
    } else {
      return false;
    }
  },

  querySelectorAll(arg) {
    if (arg === 'foo') {
      return [true];
    } else {
      return [];
    }
  },

  createElement(type) {
    return {
      type: type,
      attributes: {},
      children: [],

      setAttribute(attr, val) {
        this.attributes[attr] = val;
      },

      appendChild(child) {
        this.children.push(child);
      }

    }
  },

  createTextNode() {
    return {
      type: 'text'
    }
  }
};

describe('Library', () => {

  it('should be requirable', () => {
    assert.ok(typeof lib === 'object');
  });

  context('Private Functions', () => {

    it('aritize_', () => {
      const aritized = lib.aritize_(noop, 2);
      assert.ok(typeof aritized === 'function', 'creates a function');
      assert.doesNotThrow(function () { aritized(1, 2) }, 'works with the right arity');
      assert.throws(function () { aritized(1) }, 'fails on the wrong arity');
    });

    it('args_', () => {
      function getArgs(x, y) {
        return lib.args_(arguments);
      }

      const args = getArgs(1, 2);

      assert.ok(Array.isArray(args), 'result is array');
      assert.equal(args.length, 2, 'contains the right amount of items');
    });

    it('assign_', () => {
      const x = {[s('foo')]: 1, bar: 2};
      const y = {[s('baz')]: 3, qux: 4};

      const merged = lib.assign_(x, y);

      assert.deepEqual(merged, {
        [s('foo')]: 1,
        [s('baz')]: 3,
        bar: 2,
        qux: 4
      });
    });

    it('callChain_', () => {
      function foo(a, b) {
        return function (c, d) {
          return function (e, f) {
            return a + b + c + d + e + f;
          }
        }
      }
      assert.equal(lib.callChain_(foo, [1, 1], [1, 1], [1, 1]), 6);
    });

    it('isReserved_', () => {
      assert.throws(function () { lib.isReserved_('foo_') });
      assert.doesNotThrow(function () { lib.isReserved_('__foo__') });
      assert.doesNotThrow(function () { lib.isReserved_('foo') });
    });

    it('match_', () => {

      assert.equal(lib.match_([1], [
        {type: 'Identifier', value: 'x'}
      ]), true, 'matches 1 arg of identifier type');

      assert.equal(lib.match_([s("x"), 0], [
        {type: 'Symbol', value: 'Symbol.for("x")'},
        {type: 'Number', value: '0'}
      ]), true, 'matches 2 values of non-identifier type');

      assert.equal(lib.match_([[1, 2]], [
        {type: 'Arr', value: '[x|y]'}
      ]), true, 'matches a destructured array');

    });

  });

  context('Public Functions', () => {

    it('apply', () => {
      function foo(x) {
        return this + x;
      }

      assert.equal(lib[s("apply")](foo, [2], 2), 4);
    });

    it('attempt/handle', () => {
      let result = false;
      lib.channels_ = {};

      assert.throws(function () { lib[s("attempt")]('foo', noop) });

      lib[s("handle")](s('foo'), err => {
        result = err;
      });

      lib[s("attempt")](s('foo'), () => {
        JSON.parse('foo');
      });

      assert.ok(result);
    });

    it('copy', () => {
      const toCopy = {
        foo: 'foo',
        bar: 0,
        baz: {
          qux: [1, 2, {
            foo2: 'hello'
          }]
        }
      };

      const copied = lib[s("copy")](toCopy);

      assert.deepEqual(toCopy, copied, 'copy is identical to original');
    });

    it('dangerouslyMutate', () => {
      const foo = {bar: 'baz'};
      lib[s("dangerouslyMutate")]('bar', 'quux', foo);
      assert.equal(foo.bar, 'quux');
    });

    it('typeof', () => {
      assert.equal(lib[s("typeof")]('foo'), s('string'), 'detects a string');
      assert.equal(lib[s("typeof")](s('foo')), s('symbol'), 'detects a symbol');
      assert.equal(lib[s("typeof")](4), s('number'), 'detects a number');
      assert.equal(lib[s("typeof")](NaN), s('nan'), 'detects NaN');
      assert.equal(lib[s("typeof")](null), s('null'), 'detects null');
      assert.equal(lib[s("typeof")]([]), s('array'), 'detects an array');
      assert.equal(lib[s("typeof")](new Date()), s('date'), 'detects a date');
      assert.equal(lib[s("typeof")](/foo/), s('regexp'), 'detects a string');
      assert.equal(lib[s("typeof")]({}), s('object'), 'detects other objects');
      assert.equal(lib[s("typeof")](lib[s("vdom")][s('create')]('div')), s('vnode'), 'detects a virtual dom node')
    });

    it('die', () => {
      assert.throws(function() { lib[s("die")]('message') });
    });

    it('dom', () => {
      global.document = global.document || mockDocument;
      assert.equal(lib[s("dom")]('foo'), true, 'returns selected node');
      assert.equal(lib[s("dom")]('bar'), false, 'passes through the result of querySelector');
    });

    it('domArray', () => {
      global.document = global.document || mockDocument;
      assert.deepEqual(lib[s("domArray")]('foo'), [true], 'returns selected array of nodes');
    });

    it('eql', () => {
      assert.equal(lib[s("eql")]({
        foo: [1, 2, 3]
      }, {
        foo: [1, 2, 3]
      }), true, 'detects identical objects');
      assert.equal(lib[s("eql")]({
        foo: [1, 2, 3]
      }, {
        foo: [4, 5, 6]
      }), false, 'detects unidentical objects');
    });

    it('get', () => {
      const foo = {bar: 'baz'};
      assert.equal(lib[s("get")](foo, 'bar'), 'baz');
    });

    it('handle', () => {
      lib.channels_ = {};
      lib[s("handle")](s('foo'), noop);
      assert.equal(lib.channels_[s('foo')][0], noop);
      assert.throws(function () { lib[s("handle")]('foo', noop) });
    });

    it('head', () => {
      assert.equal(lib[s("head")]([1, 2, 3]), 1);
    });

    it('instanceof', () => {
      assert.equal(lib[s("instanceof")](noop, Function), true);
    });

    it('keys', () => {
      const foo = {[s('bar')]: 1, baz: 2};
      assert.deepEqual(lib[s("keys")](foo).sort((a, b) => {
        if (typeof a !== 'string') {
          return -1;
        } else {
          return 1;
        }
      }), [s('bar'), 'baz']);
    });

    it('last', () => {
      assert.equal(lib[s("last")]([1, 2, 3]), 3);
    });

    it('lead', () => {
      assert.deepEqual(lib[s("lead")]([1, 2, 3]), [1, 2]);
    });

    it('map', () => {
      const obj = {[Symbol.for('foo')]: 1, bar: 2};
      const arr = [1, 2, 3];

      const mappedObj = lib[Symbol.for('map')](obj, function (item) { return item });
      const mappedArr = lib[Symbol.for('map')](arr, function (item) { return item + 1 });

      assert.deepEqual(obj, mappedObj);
      assert.deepEqual(mappedArr, [2, 3, 4]);
    });

    it('merge', () => {
      const obj1 = {a: 1};
      const obj2 = {b: 2};
      const obj3 = {c: 3};
      const combinedObj = {a: 1, b: 2, c: 3};

      const arr1 = [1];
      const arr2 = [2];
      const arr3 = [3];
      const combinedArr = [1, 2, 3];

      assert.deepEqual(lib[s("merge")](obj1, obj2, obj3), combinedObj, 'merges objects');
      assert.deepEqual(lib[s("merge")](arr1, arr2, arr3), combinedArr, 'merges arrays');
    });

    it('new', () => {
      const now = +new Date;
      const date = lib[s("new")](Date, now);

      assert.ok(date);
      assert.equal(date.getTime(), now);
    });

    it('noop', () => {
      assert.equal(typeof lib[s("noop")], 'function');
      assert.equal(lib[s("noop")](), undefined);
    });

    it('random', () => {
      const foo = [1, 2, 3];
      assert.ok(foo.indexOf(lib[s("random")](foo)) > -1);
    });

    it('range', () => {
      const range = lib[s("range")](1, 10);
      assert.equal(range.length, 10, 'contains correct number of items');
      assert.equal(range[0], 1, 'first item is correct');
      assert.equal(range[range.length - 1], 10, 'last item is correct');
    });

    it('remove', () => {
      const foo = {bar: 1, baz: 2};
      const fooAfter = {bar: 1};
      const fooRemove = lib[s("remove")](foo, 'baz');

      const bar = [1, 2, 3];
      const barAfter = [1, 3];
      const barRemove = lib[s("remove")](bar, 1);

      assert.ok(foo !== fooRemove, 'generates new object');
      assert.ok(bar !== barRemove, 'generates new array');

      assert.deepEqual(fooAfter, fooRemove, 'new object looks correct');
      assert.deepEqual(barAfter, barRemove, 'new array looks correct');
    });

    it('signal', () => {
      let result = false;
      lib.channels_ = {};

      lib[s("handle")](s('foo'), sig => {
        result = sig;
      });

      lib[s("signal")](s('foo'), true);

      assert.equal(result, true, 'signal was sent and received');
      assert.throws(function () { lib[s("signal")]('foo', noop) });
    });

    it('tail', () => {
      assert.deepEqual(lib[s("tail")]([1, 2, 3]), [2, 3]);
    });

    it('throw', () => {
      const err = new Error();
      assert.throws(function () { lib[s("throw")](err) });
    });

    it('unhandle', () => {
      lib.channels_ = {};

      lib[s("handle")](s('foo'), noop);
      assert.equal(lib.channels_[s('foo')][0], noop, 'function was added');

      lib[s("unhandle")](s('foo'), noop);
      assert.equal(lib.channels_[s('foo')].length, 0, 'function was removed');
    });

    it('update', () => {
      const foo = {bar: 1, baz: 2};
      const fooAfter = {bar: 1, baz: 3};
      const fooRemove = lib[s("update")](foo, 'baz', 3);

      const bar = [1, 2, 3];
      const barAfter = [1, 4, 3];
      const barRemove = lib[s("update")](bar, 1, 4);

      assert.ok(foo !== fooRemove, 'generates new object');
      assert.ok(bar !== barRemove, 'generates new array');

      assert.deepEqual(fooAfter, fooRemove, 'new object looks correct');
      assert.deepEqual(barAfter, barRemove, 'new array looks correct');
    });

    it('vdom:create', () => {
      const vdom = lib[s("vdom")][s('create')]('div', {
        [s('class')]: 'foo',
        [s('data-foo')]: 'bar'
      }, [
        lib[s("vdom")][s('create')]('span'),
        null
      ]);

      assert.ok(vdom);
      assert.equal(vdom.tagName, 'DIV', 'produces a div tag');
      assert.equal(vdom.children.length, 1, 'creates a child element and ignores a null element');
      assert.equal(Object.keys(vdom.properties.attributes).length, 2, 'creates 2 properties on the div');
    });

  });

});
