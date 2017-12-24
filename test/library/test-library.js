import assert from 'assert';
import lib from  '../../library';

function noop() {}

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
      const x = {[Symbol.for('foo')]: 1, bar: 2};
      const y = {[Symbol.for('baz')]: 3, qux: 4};

      const merged = lib.assign_(x, y);

      assert.deepEqual(merged, {
        [Symbol.for('foo')]: 1,
        [Symbol.for('baz')]: 3,
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

      assert.equal(lib.match_([Symbol.for("x"), 0], [
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

      assert.equal(lib.apply(foo, [2], 2), 4);
    });

    it('attempt/handle', () => {
      let result = false;
      lib.channels_ = {};

      assert.throws(function () { lib.attempt('foo', noop) });

      lib.handle(Symbol.for('foo'), err => {
        result = err;
      });

      lib.attempt(Symbol.for('foo'), () => {
        JSON.parse('foo');
      });

      assert.ok(result);
    });

    it('dangerouslyMutate', () => {
      const foo = {bar: 'baz'};
      lib.dangerouslyMutate('bar', 'quux', foo);
      assert.equal(foo.bar, 'quux');
    });

    it('dataType', () => {
      assert.equal(lib.dataType('foo'), 'string', 'detects a string');
      assert.equal(lib.dataType(Symbol.for('foo')), 'symbol', 'detects a symbol');
      assert.equal(lib.dataType(4), 'number', 'detects a number');
      assert.equal(lib.dataType(NaN), 'nan', 'detects NaN');
      assert.equal(lib.dataType(null), 'null', 'detects null');
      assert.equal(lib.dataType([]), 'array', 'detects an array');
      assert.equal(lib.dataType(new Date()), 'date', 'detects a date');
      assert.equal(lib.dataType(/foo/), 'regexp', 'detects a string');
      assert.equal(lib.dataType({}), 'object', 'detects other objects');
    });

    it('die', () => {
      assert.throws(function() { lib.die('message') });
    });

    it('dom', () => {
      global.document = global.document || mockDocument;
      assert.equal(lib.dom('foo'), true, 'returns selected node');
      assert.equal(lib.dom('bar'), false, 'passes through the result of querySelector');
    });

    it('domArray', () => {
      global.document = global.document || mockDocument;
      assert.deepEqual(lib.domArray('foo'), [true], 'returns selected array of nodes');
    });

    it('eql', () => {
      assert.equal(lib.eql({
        foo: [1, 2, 3]
      }, {
        foo: [1, 2, 3]
      }), true, 'detects identical objects');
      assert.equal(lib.eql({
        foo: [1, 2, 3]
      }, {
        foo: [4, 5, 6]
      }), false, 'detects unidentical objects');
    });

    it('get', () => {
      const foo = {bar: 'baz'};
      assert.equal(lib.get(foo, 'bar'), 'baz');
    });

    it('gt', () => {
      assert.equal(lib.gt(3, 2), true);
      assert.equal(lib.gt(2, 3), false);
    });

    it('gte', () => {
      assert.equal(lib.gte(3, 2), true);
      assert.equal(lib.gte(2, 3), false);
      assert.equal(lib.gte(3, 3), true);
    });

    it('handle', () => {
      lib.channels_ = {};
      lib.handle(Symbol.for('foo'), noop);
      assert.equal(lib.channels_[Symbol.for('foo')][0], noop);
      assert.throws(function () { lib.handle('foo', noop) });
    });

    it('head', () => {
      assert.equal(lib.head([1, 2, 3]), 1);
    });

    it('instance', () => {
      const now = +new Date;
      const date = lib.instance(Date, now);

      assert.ok(date);
      assert.equal(date.getTime(), now);
    });

    it('instanceof', () => {
      assert.equal(lib.instanceof(noop, Function), true);
    });

    it('keys', () => {
      const foo = {[Symbol.for('bar')]: 1, baz: 2};
      assert.deepEqual(lib.keys(foo).sort((a, b) => {
        if (typeof a !== 'string') {
          return -1;
        } else {
          return 1;
        }
      }), [Symbol.for('bar'), 'baz']);
    });

    it('last', () => {
      assert.equal(lib.last([1, 2, 3]), 3);
    });

    it('lead', () => {
      assert.deepEqual(lib.lead([1, 2, 3]), [1, 2]);
    });

    it('lt', () => {
      assert.equal(lib.lt(3, 2), false);
      assert.equal(lib.lt(2, 3), true);
    });

    it('lte', () => {
      assert.equal(lib.lte(3, 2), false);
      assert.equal(lib.lte(2, 3), true);
      assert.equal(lib.lte(3, 3), true);
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

      assert.deepEqual(lib.merge(obj1, obj2, obj3), combinedObj, 'merges objects');
      assert.deepEqual(lib.merge(arr1, arr2, arr3), combinedArr, 'merges arrays');
    });

    it('noop', () => {
      assert.equal(typeof lib.noop, 'function');
      assert.equal(lib.noop(), undefined);
    });

    it('not', () => {
      assert.equal(lib.not(true), false);
    });

    it('random', () => {
      const foo = [1, 2, 3];
      assert.ok(foo.indexOf(lib.random(foo)) > -1);
    });

    it('range', () => {
      const range = lib.range(1, 10);
      assert.equal(range.length, 10, 'contains correct number of items');
      assert.equal(range[0], 1, 'first item is correct');
      assert.equal(range[range.length - 1], 10, 'last item is correct');
    });

    it('remove', () => {
      const foo = {bar: 1, baz: 2};
      const fooAfter = {bar: 1};
      const fooRemove = lib.remove('baz', foo);

      const bar = [1, 2, 3];
      const barAfter = [1, 3];
      const barRemove = lib.remove(1, bar);

      assert.ok(foo !== fooRemove, 'generates new object');
      assert.ok(bar !== barRemove, 'generates new array');

      assert.deepEqual(fooAfter, fooRemove, 'new object looks correct');
      assert.deepEqual(barAfter, barRemove, 'new array looks correct');
    });

    it('signal', () => {
      let result = false;
      lib.channels_ = {};

      lib.handle(Symbol.for('foo'), sig => {
        result = sig;
      });

      lib.signal(Symbol.for('foo'), true);

      assert.equal(result, true, 'signal was sent and received');
      assert.throws(function () { lib.signal('foo', noop) });
    });

    it('tail', () => {
      assert.deepEqual(lib.tail([1, 2, 3]), [2, 3]);
    });

    it('throw', () => {
      const err = new Error();
      assert.throws(function () { lib.throw(err) });
    });

    it('unhandle', () => {
      lib.channels_ = {};

      lib.handle(Symbol.for('foo'), noop);
      assert.equal(lib.channels_[Symbol.for('foo')][0], noop, 'function was added');

      lib.unhandle(Symbol.for('foo'), noop);
      assert.equal(lib.channels_[Symbol.for('foo')].length, 0, 'function was removed');
    });

    it('update', () => {
      const foo = {bar: 1, baz: 2};
      const fooAfter = {bar: 1, baz: 3};
      const fooRemove = lib.update('baz', 3, foo);

      const bar = [1, 2, 3];
      const barAfter = [1, 4, 3];
      const barRemove = lib.update(1, 4, bar);

      assert.ok(foo !== fooRemove, 'generates new object');
      assert.ok(bar !== barRemove, 'generates new array');

      assert.deepEqual(fooAfter, fooRemove, 'new object looks correct');
      assert.deepEqual(barAfter, barRemove, 'new array looks correct');
    });

    it('vdom:create', () => {
      const vdom = lib.vdom[Symbol.for('create')]('div', {
        [Symbol.for('class')]: 'foo',
        [Symbol.for('data-foo')]: 'bar'
      }, [
        lib.vdom[Symbol.for('create')]('span'),
        null
      ]);

      assert.ok(vdom);
      assert.equal(vdom.tagName, 'DIV', 'produces a div tag');
      assert.equal(vdom.children.length, 1, 'creates a child element and ignores a null element');
      assert.equal(Object.keys(vdom.properties.attributes).length, 2, 'creates 2 properties on the div');
    });

  });

});
