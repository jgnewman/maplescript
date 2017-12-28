![MapleScript](./logo.svg)
> A friendlier Lisp over JavaScript.

```
(make delicious [code]
  (maplescript:compile code))
```

MapleScript is an intuitive, application-focused Lisp dialect that compiles to JavaScript. The language itself contains both a built-in event system and a virtual DOM, as well as a JSX-like syntax for creating virtual nodes, all in about 24kb of minified overhead.

> If you're not familiar with the term, Lisps are a family of languages where most things in the language look `(like this)`. Lists enclosed in parentheses are called "s-expressions".

MapleScript is different from ClojureScript (another Lisp over JavaScript) in that it has a much simpler syntax, sticks to JavaScript's native data types, and implements functionalism less rigidly.

## Why?

The purpose behind MapleScript is to allow you to trade out 100kb+ libraries for a much smaller language that gives you the same core power natively. To illustrate, the MapleScript repository includes an ~8k framework called Syrup that leverages this power to help you build reactive, component-based applications with a redux-like state and lifecycle events.

## How it works

In MapleScript, all expressions return values and, aside from raw data, just about everything is syntactically structured like a function call. Function calls are just lists of values enclosed in parentheses (s-expressions). Here are a few JavaScript expressions and their MapleScript equivalents:

```
# JavaScript

foo(bar, baz);

Math.round();

if (x === y) {
  return foo;
} else if (x < y && x > z) {
  return bar;
} else {
  return baz;
}

# MapleScript

(foo bar baz)

(Math.round)

(if
  (= x y)
    foo
  (all (?< x y) (?> x z))
    bar
  baz)
```

## Declarations

In MapleScript, all named values (variables, functions, etc) are translated to `const` declarations and all of these are created with the `make` function.

```
# A variable `foo` with a value of 'bar'.
(make foo 'bar')

# A function `baz` taking 1 parameter `x`.
# It returns the result of adding x to x.
(make baz [x] (+ x x))
```

## Objects

MapleScript objects are just JavaScript objects. However, they are written a little differently and there is a convention of using JavaScript symbols as keys where it makes sense. In MapleScript, the syntax for referencing a symbol is `:symbol-name`. As opposed to variable names, we can use dashes in symbol names because of how they compile: `Symbol.for("symbol-name")`.

Here is an example of a MapleScript object:

```
(make person {
  :name 'John'
  :eyes 'hazel'
  :hair 'brown'
})
```

Odd numbered items are keys. Even numbered items are associated values. Of course, keys don't have to be symbols, it's just convention. When the key is a normal string key, you can access it like this: `object.key`. When it's a symbol, you can access it like this: `object:key`.

In fact, there is no array notation syntax for accessing values inside of objects. Here's how you'll do it:

```
# JavaScript

foo[0];

foo[bar];

# MapleScript

foo.0

(m:get foo bar)
```

If you need to reference `this`, you can still use the keyword `this`, or you can use `@`. For example, `@foo`, and `@:foo`.

Regarding `m:get`, `m` is a reference to the MapleScript core library and `get` retrieves values from objects and arrays.

MapleScript also takes a tip from CoffeeScript and allows you to perform "unconfident retrievals". For example, the expression `foo?:bar?.baz` will only return the value for `baz` if all the values along the chain exist. So if `foo` doesn't exist or if `foo:bar` doesn't exist, it will return undefined rather than throwing an error.

## Operators

Most of the MapleScript operators are the same as in JavaScript except that they're written in prefix notation as function calls. There are only a couple of differences as outlined below:

```
(+ x y z)  #=> x + y + z
(- x y z)  #=> x - y - z
(* x y z)  #=> x * y * z
(/ x y z)  #=> x / y / z
(= x y z)  #=> x === y === z
(!= x y z) #=> x !== y !== z
(% x y)    #=> x % y
(?< x y)   #=> x < y
(?> x y)   #=> x > y
(<= x y)   #=> x <= y
(>= x y)   #=> x >= y
(not x)    #=> !x
```

To help with some of this, there are a few built-in special forms for performing logic:

```
(all (= x y) (= a b))  #=> x === y && a === b
(any (= x y) (= a b))  #=> x === y || a === b
(none (= x y) (= a b)) #=> !(x === y) && !(a === b)
```

Notice that these are called "special forms" because even though they are structured like function calls, each argument is not eagerly evaluated. This works by transpiling to infix JavaScript operators rather than to function calls.

## Conditions

MapleScript conditions are another special form. The `if` expression looks like a function call but it can only work if we don't eagerly evaluate all of its arguments. They're conditional, after all. But thinking of it like a function call, arguments are divided into pairs where the first member of the pair is a condition and the second member is an expression to evaluate if the condition was truthy. If the last argument does not have a second pair member, it is used as an else case.

```
(make food 'pizza')

(if (= food 'pizza') (eat food))

(if
  (= food 'pizza')
    (eat food)
  # otherwise...
  (dontEat food))

(if
  (= food 'pizza')
    (m:log 'yum!')
  (= food 'fish')
    (m:log 'gross')
  (m:log 'never tried it'))
```

Sometimes you will need to execute more than one expression if a condition is true. In that case, you can use `do`. All it really does is create a block wrapped up in a single expression.

```
(if
  (= food 'pizza')
    (do
      (eat 'food')
      (m:log 'yum!')))
```

## Iteration

Although MapleScript is loosely functional, it encourages you to write functional code. To that end, it doesn't include any new iteration syntax. You can use native methods like `Array.map` or any other iterative function, or you can use recursion.

```
(make arr [1 2 3])

(arr.map (fn [num] (* num 10)))
#=> [10, 20, 30]

(make manyLogs [num]
  (m:log 'running')
  (if
    (?> num 0)
      (manyLogs (- num 1))))

(manyLogs 3)
#=> logs "running" 3 times
```

## Functions

Because all MapleScript expressions return a value, functions don't have a `return` statement. Instead, they will implicitly return the value of the last expression executed. Functions can be named or anonymous. Either way, you have the option of making them polymorphic (meaning you can execute different function bodies depending on what your arguments look like).

```
# A named function
(make add [x y]
  (+ x y))

# An anonymous function
(fn [x y]
  (+ x y))

# A polymorphic function
(make factorial
  # when there is 1 argument that equals 0
  (of [0] 1)
  # when there is 1 argument that equals anything
  (of [n] (* n (factorial (- n 1)))))
```

Within polymorphic functions, you can add qualifiers to your parameter lists. In other words, if the arguments that come in match the pattern, you can execute an additional test before the match is proved.

```
(make factorial
  (of [n :: (?< n 2)] 1) # Factorial of n where n is less than 2
  (of [n] (* n (factorial (- n 1)))))
```

Keep in mind that your patterns will be tested in the order in which they are defined.

When one of your arguments is expected to be an array, you have a few extra options for pattern matching. In the following example, we'll test for an empty array as well as destructure a populated array into variables representing the first item and a slice containing all remaining items.

```
(make doubleEach

  # When user calls function with a single argument,
  # recurse and add an accumulator.
  (of [arr] (doubleEach arr []))

  # When we get an empty array and an accumulator,
  # return the accumulator.
  (of [[] accum] accum)

  # When we get a populated array and an accumulator,
  # split the array into the first item and all remaining,
  # recurse with all remaining and add (* first 2) to the accumulator.
  (of [[first|rest] accum]
    (doubleEach rest (accum.concat (* 2 first)))))

(doubleEach [2 3 4])
#=> [4, 6, 8]
```

Additional argument destructuring will not happen within the argument pattern. You'll use the `destr` function for it.

```
(make addProps [obj]
  # Turn these props into variables with the same name
  (destr obj [:foo :bar])
  (+ foo bar))

(addProps {:foo 2 :bar 3})
#=> 5

(make mltProps [obj]
  # Turn these props into variables with different names
  (destr obj {:foo x :bar y})
  (* x y))

(mltProps {:foo 2 :bar 3})
#=> 6
```

## Data types

MapleScript sticks with JavaScript's native data types for the most part. However, it removes your ability to use the `typeof` operator and instead provides a function called `m:typeof` that will give you much better accuracy. The result of calling this function is always a symbol.

```
(m:typeof 'foo')        #=> :string
(m:typeof 100)          #=> :number
(m:typeof (fn [x] x))   #=> :function
(m:typeof [1 2 3])      #=> :array
(m:typeof {:x 'y'})     #=> :object
(m:typeof null)         #=> :null
(m:typeof undefined)    #=> :undefined
(m:typeof NaN)          #=> :nan
(m:typeof :foo)         #=> :symbol
(m:typeof /foo/g)       #=> :regexp
(m:typeof (m:new Date)) #=> :date

(make div (m:dom '#my-div'))
(m:typeof div) #=> 'htmlelement'

(make worker (m:new Worker 'url'))
(m:typeof worker) #=> 'process'

(make span <span>'hello!'</span>)
(m:typeof span) #=> 'vnode'
```

The `instanceof` operator has also been re-purposed as `m:instanceof`, however this is just a pass-through. It doesn't do anything different or special.

## Events

MapleScript has a built-in system for subscribing to and triggering events. The most important thing to keep in mind here is that all events are named by symbols.

```
(make handler [data] (m:log `I got ${data}!`))

# Subscribe to an event
(m:handle :my-event handler)

(m:signal :my-event 'foo')
#=> logs "I got foo!"

# Unsubscribe to an event
(m:unhandle :my-event handler)

(m:signal :my-event 'bar')
#=> Nothing happens
```

## Error handling

MapleScript's technique for error handling is built on the event system and allows you to decouple your "trys" from your "catches".

```
(make failer []
  (m:attempt :bad-json (fn []
    (JSON.parse 'asdfasdf'))))

(m:handle :bad-json (fn [err] (m:log err)))

(failer)
#=> Logs the error
```

## Imports & Exports

Importing modules in MapleScript is done with the `import` function. The first argument is the location of the module. The second argument is optional and represents variables to be generated from the values in that module.

```
# Import a module but don't reference any specific values
(import '/path/to/file')

# Import a module and create a variable called `foo` as a
# reference to the whole thing.
(import '/path/to/file' foo)

# Assume the module exports an object with keys `foo` and `bar`.
# Create variables called `foo` and `bar` as references to these values.
(import '/path/to/file' [foo bar])

# Assume the module exports an object with keys `:foo` and `:bar`.
# Create variables called `x` and `y` as references to these values.
(import '/path/to/file' {:foo x :bar y})
```

When it comes to exports, it is important to remember that **all MapleScript modules export an object**. No matter how you structure your export statement, the result will be an object.

```
# Export an object with key `:foo` as a reference to `foo`.
(export foo)

# Export an object with keys `:foo` and `:bar` as references
# to `foo` and `bar`.
(export [foo bar])

# Export an object with keys `:foo` and `:bar` as references
# to `foo` and `bar`.
(export {
  :foo foo
  :bar bar
})
```

The other useful tool you can apply during export is aritization. Sometimes we may define a polymorphic function where certain "morphs" are intended just for recursive purposes. For example:

```
(make doubleEach
  (of [arr] (doubleEach arr []))
  (of [[] accum] accum)
  (of [[first|rest] accum]
    (doubleEach rest (accum.concat (* 2 first)))))

# Here, we only want a user to apply the first function body
(doubleEach [1 2 3])
```

When we export this function, we can lock it down to one allowed arity (number of arguments) such that, if we try to call the function with a different number of arguments, we'll get an error. However, internally, that function can recurse with all kinds of arguments to its heart's content.

```
# Use "/1" to denote that only 1 argument is allowed.
(export [doubleEach/1])
```

## Async/Await

First and foremost, because async/await is not universal yet, you'll need to make sure you pass your compiled code through Babel or some such before trying to use it. MapleScript will translate async/await into raw ES2017 code.

Because async functions need to implement try/catch in order to properly handle rejected promises, MapleScript makes you choose an error channel for your async functions when you define them. Having done this, you can handle their errors just like you would with any other function.

```
(make foo (async :foo-error []
  (await (something cool))
  (await (more cool stuff))
  (done)))

(handle :foo-error (fn [err] (m:log err)))
```

## Context & call chains

Sometimes Lisp-y syntax can make JavaScript-y things gross.

```
((((createPromise).then (fn [result]
  (createPromise))).then (fn [result]
    (createPromise))).then (fn [result]
      (console.log result)))
```

And truthfully, it doesn't really make sense to try and chain methods off of an s-expression. So to ease your pain, MapleScript includes the "context chain". It's a special form that begins with `->` and evaluates each of its arguments in order, passing in the result of the previous one as the `this` context for the next one.

```
(-> (createPromise)
    (@then (fn [result] (createPromise)))
    (@then (fn [result] (createPromise)))
    (@then (fn [result] (m:log result))))

(-> ($ '#my-div') (@addClass 'foo') (@hide))
```

Any time you start thinking you need to put more parentheses on the left-hand side of an expression, try using a context chain instead.

Less frequently, you may find yourself in need of a "call chain" which is actually a function (not a special form) that allows you to mimic something like `foo()()()` in JavaScript:

```
(make foo [x]
  (fn [y]
    (fn [z]
      (+ x y z))))

# Instead of foo(2)(3)(4), we can do...
(>>= foo [2] [3] [4])
```

Without the call chain, you might be left having to do something like `(((foo 2) 3) 4)` and nobody likes extra parentheses on the left.

## Virtual DOM

MapleScript provides a very nice way to create virtual DOM nodes (meaning an object tree _representing_ the DOM). Virtual nodes can be rendered into real nodes or diffed against other virtual nodes to find the differences between the two virtual trees. With those differences, you can quickly make changes to an existing real DOM.

The syntax for this is inspired by React's JSX dialect, but you don't need any extra libraries to make it work. It's built in.

```
# Create a custom dom node called Title.
# Custom elements must begin with a capital letter.
(element Title [attrs children]
  <h1 {:class attrs:class}>
    children
  </h1>
)

# Build a couple virtual instances of Title
(make vTitle1 <Title {:class 'foo'}>'Hello, world!'</Title>)
(make vTitle2 <Title {:class 'bar'}>'Goodbye, world!'</Title>)

# Generate real dom nodes from one of our virtual titles
(make realTitle (m:vdom:render vTitle))

# Drop our real dom nodes into the document body
(-> (m:dom 'body') (@appendChild realTitle))

# Get the differences between our 2 virtual dom trees
(make changes (m:vdom:diff vTitle1 vTitle2))

# Use those changes to modify the real DOM which
# will automatically update.
(m:vdom:patchNodes realTitle changes)
```

## Syrup

Syrup is a simple framework built using MapleScript's virtual DOM technology to provide a somewhat React/Redux-like experience. With it, you can build components and tie them to a state object. When the state object changes, your app can re-render itself based on those changes. Here is a simple example:

```
(import 'maplescript/syrup/syrup' syrup)

# Start by defining initial state values
(make initialStateValues { :title-text 'App is alive!' })

# Create a function for transforming the state
(make reducer [state action]
  (m:merge state { :title-text action:title-text }))

# Use these values to create an application state
(make state (-> (syrup:state :my-app initialStateValues)
                (syrup:reduce @ reducer)))

### Now we'll create a nested component architecture ###

# Define a basic Title element
(element TitleBase [attrs]
  <h1>attrs:title-text</h1>
)

# Now extend that element with lifecycle events
(make Title (-> TitleBase
                (syrup:afterMount @ (fn [attrs] (m:log 'aftermount')))
                (syrup:beforeUnmount @ (fn [attrs] (m:log 'beforeunmount')))))

# Define our top-level application element
# It will create an instance of Title
(element App [attrs]
  <div {:class 'app'}>
    <Title {:title-text attrs:state:title-text} />
  </div>
)

# Render our app (with state!) into the DOM
(syrup:render App state '#app')

### Now we'll modify the state and trigger an auto-rerender ###

# Send data on the event channel associated with the state
(m:signal :my-app { :title-text 'App is reactive!' })

# The app automatically re-renders using the new text.
```

## How to Use It

### Directly

```javascript
import { compile, compileCode } from 'maplescript';

compile('path/to/file.maple', (err, result) => {
  if (err) throw err;
  fs.writeFileSync('path/to/output.js', result);
})

// or...

const javascript = compileCode("(make x 4)");
```

### As a webpack loader

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

### In a gulp task

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

### With Browserify

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
