---
layout: docs
---

{{#markdown}}
{{{{raw}}}}

![MapleScript](https://github.com/jgnewman/maplescript/raw/master/logo.svg?sanitize=true)

```maplescript
(make (delicious code)
  (maplescript:compile code))
```

Say hello to MapleScript, a lightweight and intuitive Lisp over JavaScript.

MapleScript may not be Canadian, but it _does_ compile to JavaScript. It can be used with any JS library and contains a built-in event system, a virtual DOM, and a JSX-like syntax for creating html, all in about 24kb of minified overhead.

<div class="warning">
_**Be warned:** MapleScript is **not** compatible with Internet Explorer. It requires a recent version of Edge (or any other recent browser) to run._
</div>

## Why did you make it?

The purpose behind MapleScript is to allow you to trade out 100kb+ libraries for a much smaller language that gives you the same core power natively. To illustrate, the MapleScript repository includes an ~8kb framework called Syrup that leverages this power to help you build reactive, component-based applications with a redux-like state and lifecycle events.

## Installing

You can install MapleScript via npm or yarn.

```
npm install --save-dev maplescript

# or

yarn add maplescript --dev
```

### Compiling Manually

```javascript
import { compile, compileCode } from 'maplescript';

compile('path/to/file.maple', (err, result) => {
  if (err) throw err;
  fs.writeFileSync('path/to/output.js', result);
}, {finalize: true})

// or...

const javascript = compileCode("(make x 4)", callback, {finalize: true});
```

Note that if the `finalize` option is not set to true, you will not get the core library included in the output. This is automatically set to true for each of the provided plugins.

### Webpack Loader

```javascript
import maple from 'maplescript/plugins/webpack';

// ...in the config...

{
  module: {
    loaders: [
      { test: /\.maple$/, loader: maple() },
    ]
  }
}
```

### Gulp Plugin

```javascript
import gulp from 'gulp';
import { log } from 'gulp-util';
import maple from 'maplescript/plugins/gulp';

gulp.task('maple', () => {
  gulp.src('./src/*.maple')
    .pipe(maple().on('error', log))
    .pipe(gulp.dest('./public/'));
});
```

### Browserify Plugin

```javascript
import gulp from 'gulp';
import browserify from 'browserify';
import mapleify from 'maplescript/plugins/browserify';
import source from 'vinyl-source-stream'; // <- standard re-gulpification

gulp.task('maple', function () {
  return browserify({entries: ['/path/to/entry.maple'], extensions: ['.maple']})
         .transform(mapleify)
         .bundle()
         .pipe(source('app.js'))
         .pipe(gulp.dest('path/to/output_directory'));
});
```

## Language Reference

In MapleScript, all expressions return values and, aside from raw data, just about everything is syntactically structured like a function call. Function calls are just lists of values enclosed in parentheses ("s-expressions"). Here are a few MapleScript s-expressions and their JavaScript equivalents:

```maplescript
(foo bar baz)
-- foo(bar, baz);

(Math.round)
-- Math.round();

(if
  (= x y) foo
  (all (?< x y) (?> x z)) bar
  baz)

---
if (x === y) {
  return foo;
} else if (x < y && x > z) {
  return bar;  
} else {
  return baz;  
}
---
```

### Comments

As you may have already noticed, single line comments are prefixed with `--` while multi-line comments are surrounded by two instances of `---`, just like YAML front matter.

```maplescript
-- This is a single line comment.

---
This is a multi-line
comment block.
---
```

### Declarations

In MapleScript, all named values (variables, functions, etc) are translated to `const` declarations and all of these are created with the `make` function.

Normally, `make` takes 2 arguments — one for the variable name and one for the value:

```maplescript
-- A variable `foo` with a value of 'bar'.
(make foo 'bar')
```

However, when you're defining a function, `make` takes any even number of arguments. You can think of these arguments as occurring in pairs where the first item in the pair is a pattern that describes a way the function can be called and the second item in the pair is what should be returned when that pattern is used:

```maplescript
-- Whenever we call `baz` of `x`,
-- we'll return the result of adding x to x.
(make (baz x) (+ x x))
```

You can give `make` additional arguments in order to create more patterns for your function. This is discussed more in the section on [functions](#functions).

### Objects

MapleScript objects are just JavaScript objects. However, they are written a little differently and there is a convention of using JavaScript symbols as keys where possible. In MapleScript, the syntax for referencing a symbol is `:symbol-name`.

You are allowed to use dashes in symbol names because of how they compile: `Symbol.for("symbol-name")`.

Here is an example of a MapleScript object:

```maplescript
(make person {
  :name 'John'
  :eyes 'hazel'
  :hair 'brown'
})
```

Odd numbered items are keys. Even numbered items are associated values. Of course, keys don't have to be symbols, it's just convention. When the key is a normal string key, you can access it like this: `object.key`. When it's a symbol, you can access it like this: `object:key`.

In fact, there is no array notation syntax for accessing values inside of objects. Here's how you'll do it:

```maplescript
foo.0
-- foo[0];

(m:get foo bar)
-- foo[bar];
```

If you need to reference `this`, you can still use the keyword `this`, or you can use `&`. For example, `&foo`, `&.foo`, and `@:foo`.

Regarding `m:get`, `m` is a reference to the MapleScript core library (which is always available) and `get` retrieves values from objects and arrays.

MapleScript also takes a tip from CoffeeScript and allows you to perform "unconfident retrievals". For example, the expression `foo?:bar?.baz` will only return the value for `baz` if all the values along the chain exist. So if `foo` doesn't exist or if `foo:bar` doesn't exist, it will return undefined rather than throwing an error.

### Operators

Most of the MapleScript operators are the same as in JavaScript except that they're written in prefix notation as function calls. There are only a couple of differences as outlined below:

```maplescript
(+ x y z)   =>  x + y + z
(- x y z)   =>  x - y - z
(* x y z)   =>  x * y * z
(/ x y z)   =>  x / y / z
(= x y z)   =>  x === y === z
(!= x y z)  =>  x !== y !== z
(% x y)     =>  x % y
(?< x y)    =>  x < y
(?> x y)    =>  x > y
(<= x y)    =>  x <= y
(>= x y)    =>  x >= y
(not x)     =>  !x
```

To help with some of this, there are a few built-in special forms for performing logic:

```maplescript
(all (= x y) (= a b))
=>  x === y && a === b

(any (= x y) (= a b))
=>  x === y || a === b

(none (= x y) (= a b))
=>  !(x === y) && !(a === b)
```

Notice that these are called "special forms" because even though they are structured like function calls, each argument is not eagerly evaluated. This works because we transpile to infix JavaScript operators rather than to actual function calls.

### Conditions

The MapleScript condition is another special form. The `if` expression looks like a function call but it can only work properly if we don't eagerly evaluate all of its arguments. They're conditional, after all.

But if we think of `if` like a function call, arguments are divided into pairs where the first member of the pair is a condition and the second member is an expression to evaluate if the condition was truthy. If the last argument does not have a second pair member, it is used as an else case.

```maplescript
(make food 'pizza')

(if (= food 'pizza') (eat food))

(if
  (= food 'pizza')
    (eat food)
  -- otherwise...
  (dontEat food))

(if
  (= food 'pizza') (m:log 'yum!')
  (= food 'fish') (m:log 'gross')
  (m:log 'never tried it'))
```

Sometimes you will need to execute more than one expression if a condition is true. In that case, you can use the `do` special form.

All `do` really does is create a block of many expressions wrapped up in a single expression.

```maplescript
(if
  (= food 'pizza')
    (do
      (eat 'food')
      (m:log 'yum!')))
```

### Iteration

Although MapleScript is loosely functional, it encourages you to write functional code. To that end, it doesn't include any new iteration syntax. You can use native methods like `Array.map` or any other iterative function, or you can use recursion.

```maplescript
(make arr [1 2 3])

(arr.map (@ [num] (* num 10)))
=> [10, 20, 30]

(make (manyLogs num)
  (do (m:log 'running')
      (if (?> num 0) (manyLogs (- num 1)))))

(manyLogs 3)
=> logs "running" 3 times
```

### Functions

Because all MapleScript expressions return a value, functions don't have `return` statements. Instead, they will implicitly return the value of the last expression executed.

Functions can be named or anonymous. Either way, you have the option of making them polymorphic (meaning you can execute different function bodies depending on what your arguments look like).

Functions are created using the `make` command, which must take an even number of arguments. Those arguments can be thought of as occurring in pairs where the first member of the pair is a function pattern and the second member represents what is returned when that pattern is matched. In order to execute multiple commands within a function body, you'll wrap them up in a `do` block.

Unnamed (anonymous) functions are created by calling the `@` function. If the first argument you pass to `@` is an array, its items will be used as parameters for the function.

```maplescript
-- A function `add` taking x and y
-- It returns the result of adding x to y.

(make (add x y) (+ x y))

-- An anonymous function with the same job.

(@ [x y] (+ x y))

-- A function with two possible patterns.
-- If we call (factorial 0), we'll return 1.
-- If we call (factorial n), we'll recurse until
-- we hit the other pattern.

(make (factorial 0) 1
      (factorial n) (* n (factorial (- n 1))))

-- A function where the body executes
-- multiple commands

(make (foo x)
  (do (something x)
      (somethingElse x)))
```

Within polymorphic functions, you can add qualifiers to your parameter lists. In other words, if the arguments that come in match the pattern, you can execute an additional test before the match is proved.

```maplescript
-- Factorial of n where n is less than 2, return 1.
-- Factorial of n in any other case, recurse.

(make (factorial n (where (?< n 2))) 1
      (factorial n) (* n (factorial (- n 1))))
```

Keep in mind that your patterns will be tested in the order in which they are defined.

When one of your arguments is expected to be an array, you have a few extra options for pattern matching. In the following example, we'll test for an empty array as well as destructure a populated array into variables representing the first item and a slice containing all remaining items.

```maplescript
-- A function for doubling each number in an array.
(make

  -- With just one argument, recurse and add an accumulator.
  (doubleEach arr)
    (doubleEach arr [])

  -- With an empty array and accumulator, return the accumulator.
  (doubleEach [] accum)
    accum

  -- Otherwise, destructure our array into the first item and
  -- a new array of all remaining items. Multiply the first item
  -- by 2 and add it to the accumulator then recurse with the
  -- rest of the items so we eventually hit the second pattern.
  (doubleEach [first|rest] accum)
    (doubleEach rest (accum.concat (* 2 first))))

(doubleEach [2 3 4])
=> [4, 6, 8]
```

Note that in the above function, `first|rest` must not contain any spaces.

Additional argument destructuring will not happen within the argument pattern. Instead, you'll use the `destr` function for it.

```maplescript
-- Turn object properties into variables with the same names
(make (addProps obj)
  (do (destr obj [ :foo :bar ])
      (+ foo bar)))

(addProps { :foo 2 :bar 3 })
=> 5

-- Turn object properties into variables with different names
(make (mltProps obj)
  (do (destr obj { :foo x :bar y })
      (* x y)))

(mltProps { :foo 2 :bar 3 })
=> 6
```

### Data types

MapleScript sticks with JavaScript's native data types for the most part. However, it removes your ability to use the `typeof` operator and instead provides a function called `m:typeof` that will give you much better accuracy. The result of calling this function is always a symbol.

```maplescript
(m:typeof 'foo')         =>  :string
(m:typeof 100)           =>  :number
(m:typeof (@ x))         =>  :function
(m:typeof [1 2 3])       =>  :array
(m:typeof { :x 'y' })    =>  :object
(m:typeof null)          =>  :null
(m:typeof undefined)     =>  :undefined
(m:typeof NaN)           =>  :nan
(m:typeof :foo)          =>  :symbol
(m:typeof /foo/g)        =>  :regexp
(m:typeof (m:new Date))  =>  :date

(make div (m:dom '#my-div'))
(m:typeof div)           =>  :htmlelement

(make worker (m:new Worker 'url'))
(m:typeof worker)        =>  :process

(make span <\span>'hello!'<\/span>)
(m:typeof span)          =>  :vnode
```

The `instanceof` operator has also been re-purposed as `m:instanceof`, however this is just a pass-through. It doesn't do anything different or special.

### Events

MapleScript has a built-in system for subscribing to and triggering events. The most important thing to keep in mind here is that all events are named by symbols.

```maplescript
(make (handler data)
  (m:log `I got ${data}!`))

-- Subscribe to an event
(m:handle :my-event handler)

-- Trigger the event
(m:signal :my-event 'foo')
=> logs "I got foo!"

-- Unsubscribe to an event
(m:unhandle :my-event handler)

(m:signal :my-event 'bar')
=> Nothing happens
```

### Error handling

MapleScript's technique for error handling is built on the event system and allows you to decouple your "trys" from your "catches".

The `m:attempt` function takes an event channel and a function to execute. If that function throws an error, the error will be caught and signaled along the event channel.

```maplescript
(make (failer)
  (m:attempt :bad-json (@ (JSON.parse 'asdfasdf'))))

(m:handle :bad-json (@ [err] (m:log err)))

(failer)
=> Logs the error
```

### Imports & Exports

Importing modules in MapleScript is done with the `import` function. The first argument is the location of the module. The second argument is optional and represents variables to be generated from the values in that module.

```maplescript
-- Import a module but don't reference any specific values

(import '/path/to/file')

-- Import a module and create a variable called `foo` as a
-- reference to the whole thing.

(import '/path/to/file' foo)

-- Assume the module exports an object with keys `foo` and `bar`.
-- Create variables called `foo` and `bar` as references to these values.

(import '/path/to/file' [foo bar])

-- Assume the module exports an object with keys `:foo` and `:bar`.
-- Create variables called `x` and `y` as references to these values.

(import '/path/to/file' { :foo x :bar y })
```

When it comes to exports, it is important to remember that **all MapleScript modules export an object**. No matter how you structure your export statement, the result will be an object.

```maplescript
-- Export an object with key `:foo` as a reference to `foo`.

(export foo)

-- Export an object with keys `:foo` and `:bar` as references
-- to values `foo` and `bar`.

(export [foo bar])

-- Export an object with keys `:foo` and `:bar` as references
-- to values `foo` and `bar`.

(export {
  :foo foo
  :bar bar
})
```

The other useful tool you can apply during export is aritization. Sometimes we may define a polymorphic function where certain "morphs" are intended just for recursive purposes. For example:

```maplescript
(make
  (doubleEach arr)
    (doubleEach arr [])
  (doubleEach [] accum)
    accum
  (doubleEach [first|rest] accum)
    (doubleEach rest (accum.concat (* 2 first))))

-- Here, we only want a user to apply the first function body
(doubleEach [1 2 3])
```

When we export this function, we can lock it down to one allowed "arity" (number of arguments) such that, if we try to call the function with a different number of arguments, we'll get an error. However, internally, that function can recurse with all kinds of arguments to its heart's content.

```maplescript
-- Use "/1" to denote that only 1 argument is allowed.
(export [doubleEach/1])
```

### Async/Await

First and foremost, because async/await is not universal yet, you'll need to make sure you pass your compiled code through Babel or some such before trying to use it. MapleScript will translate async/await into raw ES2017 code.

Because async functions need to implement try/catch in order to properly handle rejected promises, MapleScript makes you choose an error channel for your async functions when you define them. Having done this, you can handle their errors just like you would with any other function.

```maplescript
(make foo
  (@async :foo-error []
    (await (something cool))
    (await (more cool stuff))
    (done)))

(handle :foo-error (@ [err] (m:log err)))
```

### Chains

Sometimes Lisp-y syntax can make JavaScript-y things gross. Consider trying to chain promises:

```maplescript
((((createPromise).then (@ [result]
  (createPromise))).then (@ [result]
    (createPromise))).then (@ [result]
      (console.log result)))
```

Aside from just looking ugly, it doesn't really make sense to try and chain methods off of an s-expression. So to ease your pain in cases like this, MapleScript includes the "context chain".

A context chain is a special form that begins with `->` and evaluates each of its arguments in order, passing in the result of the previous one as the `this` context for the next one.

```maplescript
(-> (createPromise)
    (&then (@ [result] (createPromise)))
    (&then (@ [result] (createPromise)))
    (&then (@ [result] (m:log result))))

(-> ($ '#my-div')
    (&addClass 'foo')
    (&hide))
```

Any time you start thinking you need to put more parentheses on the left-hand side of an expression, try using a context chain instead.

Less frequently, you may find yourself in need of a "call chain" which is actually a function (not a special form) that allows you to mimic something like `foo()()()` in JavaScript:

```maplescript
(make (foo x)
  (@ [y]
    (@ [z]
      (+ x y z))))

-- Instead of foo(2)(3)(4), we can do...
(>>= foo [2] [3] [4])
```

Without the call chain, you might be left having to do something like `(((foo 2) 3) 4)` and nobody likes extra parentheses on the left.

### Virtual DOM

MapleScript provides a very nice way to create virtual DOM nodes (meaning an object tree _representing_ the DOM). Virtual nodes can be rendered into real nodes or diffed against other virtual nodes to find the differences between the two virtual trees. With those differences, you can quickly make changes to an existing real DOM.

The syntax for this is inspired by React's JSX dialect, but you don't need any extra libraries to make it work. It's built in. We call it MapleML.

```maplescript
-- Create a custom dom node called Title.
-- Custom element functions must begin with a capital letter
-- in order to be compiled correctly when written
-- with MapleML.

(make (Title attrs children)
      <\h1 { :class attrs:class }>
        children
      <\/h1>)

-- Build a couple virtual instances of Title
(make vTitle1 <\Title { :class 'foo' }>'Hello, world!'<\/Title>)
(make vTitle2 <\Title { :class 'bar' }>'Goodbye, world!'<\/Title>)

-- Generate real dom nodes from one of our virtual titles
(make realTitle (m:vdom:render vTitle))

-- Drop our real dom nodes into the document body
(-> (m:dom 'body') (&appendChild realTitle))

-- Get the differences between our 2 virtual dom trees
(make changes (m:vdom:diff vTitle1 vTitle2))

-- Use those changes to modify the real DOM which
-- will automatically update.
(m:vdom:patchNodes realTitle changes)
```

## Core library

MapleScript comes with a collection of built-in functions that make life a lot easier. They are all available under the global `m` namespace, which is always available to you without having to import anything.

### `(m:apply fun args [ctx])`

Calls a provided function (`fun`) with argument list `args`, optionally with provided context `ctx`. Returns the result of the applied function.

- `fun` - A function to call.
- `args` - Array. Contains all arguments to pass to the function.
- `ctx` - Optional. A context in which to call the function.

```maplescript
(make (logger text)
  (m:log text))

(m:apply logger ['hello, world!'])
=> logs 'hello, world!'
```

### `(m:attempt channel fun)`

Calls a provided function (`fun`) and checks to see if it produced any errors. If it did, catches the error and broadcasts it on a global event channel (`channel`). If no errors are produced, returns the result of calling `fun`.

- `channel` - Symbol. An event channel name.
- `fun` - Function. Will be executed and checked for errors.

```maplescript
(m:handle :bad-json
          (@ [err] (m:log err)))

(m:attempt :bad-json
           (@ (JSON.parse 'asdfasdf')))
```

### `(m:bind fun, ctx)`

Binds a function to a context and returns the new function.

- `fun` - Any function.
- `ctx` - Any value. Will become the `this` context of the new function.

```maplescript
(make ctx 'foo')

(make (myfun)
  (m:bind (@ (m:log &)) ctx))

(myfun)
-- logs 'foo'
```

### `(m:copy collection)`

Generates a deep copy of a provided value (`collection`) as long as that value is an object or an array. If any other data type is provided, will return the provided value.

- `collection` - Object or Array. The collection to be copied.

```maplescript
(make obj { :foo 'bar' })

(make copy (m:copy obj))

obj:foo   =>  'bar'
copy:foo  =>  'bar'

(= foo copy)  =>  false
```

### `(m:dangerouslyMutate key val object)`

Allows you to mutate the value of a key in an existing object. This is necessary to perform certain JavaScript actions such as setting `location.href`.

- `key` - String or Symbol. The name of the key to mutate.
- `val` - The new value for the key.
- `object` - The object receiving the change.

```maplescript
-- dangerously mutate href to foo in location
(m:dangerouslyMutate 'href' '/foo' location)
```

### `(m:die msg)`

Creates and throws an error built from a provided message (`msg`).

- `msg` - String. The error message.

```maplescript
(m:die 'Application broke!')
```

### `(m:dom selector)`

Selects a single element from the real DOM by the provided selector.

- `selector` - String. A standard, CSS selector string.

```maplescript
(m:dom '.my-class')
=> <\div class="my-class">
```

### `(m:domArray selector)`

Selects an array of elements from the real DOM by the provided selector.

- `selector` - String. A standard, CSS selector string.

```maplescript
(m:domArray '.my-class')
=> [<\div class="my-class">, <\div class="my-class">]
```

### `(m:eql obj1 obj2)`

Determines whether two provided objects are deep equal. Returns a boolean.

- `obj1` - One of two objects to compare.
- `obj2` - Another of two objects to compare.

```maplescript
(m:eql { :foo 'bar' }
       { :foo 'bar' })
=> true

(m:eql [1 2 3]
       [1 2 3 4])
=> false
```

### `(m:get collection key)`

Retrieves a value from a collection.

- `collection` - Any kind of object with retrievable values.
- `key` - Number, String, or Symbol. Identifies the key of the value to be retrieved.

```maplescript
(make person { :name 'John' })

(make key :name)

(m:get person key)
=> 'John'
```

### `(m:handle channel fun)`

Registers a handler function (`fun`) for events broadcast on a global event channel (`channel`). Returns the handler.

- `channel` - Symbol. The name of an event channel.
- `fun` - The handler function. Takes the data sent over the channel.

```maplescript
(m:handle :my-event (@ [data] (m:log data)))

(m:signal :my-event 'foo')
=> logs 'foo'
```

### `(m:head array)`

Retrieves the first item in an array.

- `array` - Any array.

```maplescript
(m:head [1 2 3])
=> 1
```

### `(m:instanceof val type)`

Determines whether a value (`val`) was built from a constructor (`type`). Returns a boolean.

- `val` - Any value.
- `type` - A constructor function.

```maplescript
(make date (m:new Date))

(m:instanceof date Date)
=> true
```

### `(m:dom selector)`

Selects a single element from the real DOM by the provided selector.

- `selector` - String. A standard, CSS selector string.

```maplescript
(m:dom '.my-class')
#=> <\div class="my-class">
```

### `(m:keys object)`

Returns an array of all string and symbol keys in a provided object.

- `object` - The object whose keys we want to retrieve.

```maplescript
(make obj {
  foo   1
  "bar" 2
  :baz  3
})

(m:keys obj)
=> ["foo", "bar", Symbol.for("baz")]
```

### `(m:last array)`

Retrieves the last item in an array.

- `array` - Any array.

```maplescript
(m:last [1 2 3])
=> 3
```

### `(m:lead array)`

Creates a slice of all array items except the last one.

- `array` - Any array.

```maplescript
(m:lead [1 2 3])
=> [1, 2]
```

### `(m:log ...msgs)`

A pass-through to console.log. If `console` does not exist in the current environment, fails silently.

- `...msgs` - Items to log to the console.

```maplescript
(m:log 'hello' 'world')
=> logs 'hello' 'world'
```

### `(m:map collection fun)`

Iterates over all items in an array or object and returns a new shallow copy of that object as the result of calling a function (`fun`) on each item.

- `collection` - Any array or plain object.
- `fun` - A function to call for each item. Takes arguments `item` and `index/key`.

```maplescript
(m:map [1 2 3] (@ [item index]
  (if (= 0 (% index 2))
        (* item 10))
      item))
=> [1, 20, 3]

(m:map { :foo 1 :bar 2 } (@ [item key]
  (if (= key :foo)
        (* item 10))
      item))
=> { [Symbol.for("foo")]: 10, [Symbol.for("bar")]: 2 }
```

### `(m:merge ...objects)`

Takes a series of objects or arrays and merges them into a new object/array containing shallow-ly copied items from each argument.

- `...objects` - Arrays or objects.

```maplescript
(m:merge { :foo 1 } { :bar 2 })
=> { :foo 1 :bar 2 }

(m:merge [1 2] [3 4])
=> [1 2 3 4]
```

### `(m:new constructor [...args])`

Instantiates a constructor.

- `constructor` - A function for constructing an object.
- `...args` - Optional arguments to pass to the constructor.

```maplescript
(m:new Date '10/21/1985')
=> Mon Oct 21 1985 00:00:00 GMT-0400 (EDT)
```

### `m:noop`

You will sometimes need a function that does nothing. Here's one for you.

```maplescript
(m:noop)
=> nothing happens
```

### `(m:random array)`

Selects a random item from an array.

- `array` - Any array.

```maplescript
(m:random [1 2 3 4 5])
=> 2

(m:random [1 2 3 4 5])
=> 5
```

### `(m:range from through)`

Creates an array populated by all numbers from `from` through `through`.

- `from` - Number. The first item in the range.
- `through` - Number. The last item in the range.

```maplescript
(m:range 1 10)
[1 2 3 4 5 6 7 8 9 10]
```

### `(m:remove collection key)`

Returns a new, shallow copy of a collection with a provided key removed.

- `collection` - Object or Array. Contains an item to be removed.
- `key` - Identifies the object key or array index to be removed.

```maplescript
(make obj { :foo 1 :bar 2 })
(make arr ['a' 'b' 'c'])

(m:remove obj :foo)
=> { :bar 2 }

(m:remove arr 1)
=> ['a' 'c']
```

### `(m:signal channel [data])`

Broadcasts data on a global event channel. Returns undefined.

- `channel` - Symbol. The name of the event.
- `data` - Optional. Data to send along with the event.

```maplescript
(m:handle :my-event (@ [data] (m:log data)))

(m:signal :my-event 'foo')
=> logs 'foo'
```

### `(m:tail array)`

Creates a slice of all array items except the first one.

- `array` - Any array.

```maplescript
(m:tail [1 2 3])
=> [2, 3]
```

### `(m:throw err)`

Throws an error object.

- `err` - Any error object.

```maplescript
(m:throw (n:new Error))
=> ERROR!
```

### `(m:typeof data)`

Determines the type of `data` and returns one of the following symbols:
`:array, :boolean, :date, :function, :htmlelement, :nan, :null, :number, :object, :process, :regexp, :string, :symbol, :undefined, :vnode`. Provides more accurate output than JavaScript's native `typeof` operator.

- `data` - Any value.

```maplescript
(m:typeof [])                    =>  :array
(m:typeof true)                  =>  :boolean
(m:typeof (m:new Date))          =>  :date
(m:typeof (@ null))              =>  :function
(m:typeof (m:dom 'div'))         =>  :htmlelement
(m:typeof NaN)                   =>  :nan
(m:typeof null)                  =>  :null
(m:typeof 4)                     =>  :number
(m:typeof {})                    =>  :object
(m:typeof (m:new Worker 'url'))  =>  :process
(m:typeof /foo/g)                =>  :regexp
(m:typeof 'foo')                 =>  :string
(m:typeof :foo)                  =>  :symbol
(m:typeof undefined)             =>  :undefined
(m:typeof <\div><\/div>)         =>  :vnode
```

### `(m:unhandle channel fun)`

Removes a handler function from a global event channel. Returns undefined.

- `channel` - Symbol. The name of the event.
- `fun` - The function to remove.

```maplescript
(make handler (@ [data] (m:log data)))

(m:handle :my-event handler)

(m:signal :my-event 'foo')
=> logs 'foo'

(m:unhandle :my-event handler)

(m:signal :my-event 'foo')
=> nothing happens
```

### `(m:update collection key val)`

Returns a new, shallow copy of a collection with a provided key updated with a new value.

- `collection` - Object or Array. Contains an item to be updated.
- `key` - Identifies the object key or array index to be updated.
- `val` - The new value for the key.

```maplescript
(make obj { :foo 1 :bar 2 })
(make arr ['a' 'b' 'c'])

(m:update obj :foo 3)
=> { :foo 3 :bar 2 }

(m:update arr 1 'd')
=> ['a' 'd' 'c']
```

### `(m:vdom:create type [attrs] [children])`

Creates a new virtual DOM node. MapleML syntax is a shortcut for this function.

- `type` - String. The type of node to create.
- `attrs` - Optional. An object specifying all attributes. Each should be named with a symbol.
- `children` - Optional. An array of child virtual DOM nodes.

```maplescript
(m:vdom:create 'div' { :class 'my-class' } [
  (m:vdom:create 'span' {} ['Hello, world!'])
])

-- produces the same thing as...

<\div { :class 'my-class' }>
  <\span>
    'Hello, world!'
  <\/span>
<\/div>

-- which is a virtual tree
```

### `(m:vdom:diff vtree1 vtree2)`

Compares two virtual trees and outputs the differences between them.

- `vtree1` - VNode. The result of calling `m:vdom:create`.
- `vtree2` - Another VNode.

```maplescript
(make tree1 <\div>'hello'<\/div>)
(make tree2 <\div>'goodbye'<\/div>)

(m:vdom:diff tree1 tree2)
=> Object of differences
```

### `(m:vdom:render vtree)`

Converts a virtual DOM tree into a tree of real DOM nodes.

- `vtree` - VNode. The result of calling `m:vdom:create`.

```maplescript
(make tree1 <\div>'hello'<\/div>)
(make tree2 <\div>'goodbye'<\/div>)

(m:vdom:render <\div { :class 'foo' }>'hello'<\/div>)
=> <\div class="foo">hello<\/div>
```

### `(m:vdom:injectNodes nodes target)`

Injects a tree of nodes into the real DOM. Returns the tree of real nodes.

- `nodes` - VNode or HtmlElement.
- `target` - String or HtmlElement.

```maplescript
(m:vdom:injectNodes <\div { :class 'foo' }>'hello'<\/div> '#app')
-- Injects real nodes into the selement identified by '#app'.
-- Returns <\div class="foo">hello<\/div>
```

### `(m:vdom:patchNodes realNodes changes)`

Updates a tree of real DOM nodes according to an object of virtual DOM changes.

- `realNodes` - HtmlElement.
- `changes` - Object. The result of calling `m:vdom:diff` on two virtual trees.

### `(m:warn ...msgs)`

A pass-through to console.warn. If `console` does not exist in the current environment, fails silently.

- `...msgs` - Items to log to the console.

```maplescript
(m:warn 'Scary warning!')
-- logs 'Scary warning!'
```

## Syrup

Syrup is a simple framework built using MapleScript's virtual DOM technology to provide a somewhat React/Redux-like experience. With it, you can build components and tie them to a state object. When the state object changes, your app can re-render itself based on those changes. Here is a simple example:

```maplescript
(import 'maplescript/syrup/syrup' syrup)

-- Start by defining initial state values
(make initialStateValues { :title-text 'App is alive!' })

-- Create a function for transforming the state
(make (reducer state action)
  (m:merge state { :title-text action:title-text }))

-- Use these values to create an application state
(make state (-> (syrup:state :my-app initialStateValues)
                (syrup:reduce & reducer)))

--- Now we'll create a nested component architecture ---

-- Define a basic Title element
(make (TitleBase attrs)
  <\h1>attrs:title-text<\/h1>
)

-- Now extend that element with lifecycle events
(make Title (-> (syrup:afterMount TitleBase (@ (m:log 'aftermount')))
                (syrup:beforeUnmount & (@ (m:log 'beforeunmount')))))

-- Define our top-level application element
-- It will create an instance of Title
(make (App attrs)
  <\div { :class 'app' }>
    <\Title { :title-text attrs:state:title-text } />
  <\/div>
)

-- Render our app (with state!) into the DOM
(syrup:render App state '#app')

--- Now we'll modify the state and trigger an auto-rerender ---

-- Send data on the event channel associated with the state
(m:signal :my-app { :title-text 'App is reactive!' })

-- The app automatically re-renders using the new text.
```


{{{{/raw}}}}
{{/markdown}}
