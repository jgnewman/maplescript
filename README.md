# MapleScript
> A friendlier Lisp over JavaScript.

## What is a Lisp?

Lisp is a family of programming languages where the most distinctive feature is that all expressions are structured as lists enclosed in parentheses.

## Isn't ClojureScript already a Lisp over JavaScript? Why make another one?

ClojureScript is awesome. But it's also big and heavy because it tries to implement as much of the full Clojure language as possible. It has a lot of features that, while cool, aren't really necessary and can slow things down.

MapleScript, on the other hand, is extremely light-weight and focuses on applying functionalism to JavaScript without too much unfamiliarity. Like CoffeeScript, it has relatively minimal overhead and contains many similar benefits.

## What are some of MapleScript's distinguishing features?

1. You get polymorphic functions with pattern matching and argument destructuring!
2. The syntax is clear and intuitive (you'll pick it up quick!), and makes heavy use of ES6 Symbols.
3. There is a built-in event bus and it's used to power error handling, allowing you to decouple your tries from your catches.

Oh, and one other thing: there is a **VIRTUAL DOM AND NATIVE HTML-LIKE SYNTAX _BUILT IN_ TO THE LANGUAGE**.

That means you can do things like build your very own reactive, component-based JS framework with just a couple of functions. And with all of this, the entire language comes in at only around 24k minified. That's 1/4 the size of jQuery 3 or Vue 2, and just over 1/5 the size of React 16 (with react-dom) — the point being that you won't need these big heavy frameworks anymore. Which is good. Because it's time for the rise of functionalism!

## Can I see some examples?

Sure! In the following examples, I'll give you the MapleScript code and include the equivalent JavaScript to help you get a feel for what's going on.

In MapleScript, everything is structured like a function call, and function calls look like this:

```
# MapleScript
(function_to_call arg1 arg2)

# JavaScript
function_to_call(arg1, arg2)
```

It's just a list wrapped in parentheses where the first list item is a function to call and each subsequent item is an argument to pass in. In the world of Lisps, we call these "s-expressions".

Even math is done this way!

```
# MapleScript
(+ 2 3 4)

# JavaScript
2 + 3 + 4
```

And the most important function to learn about in MapleScript is `make` because it's what you'll use to define almost _everything_:

```
# MapleScript
(make foo 4)

(make add [x y] (+ x y))

# JavaScript
const foo = 4;

const add = function (x, y) {
  return x + y;
}
```

`make` knows when you're making a function because functions have parameter lists and bodies. And yes, everything you make with `make` will be defined as a `const` in JavaScript.

Of course, sometimes you'll want your functions to take on a different form depending on the way arguments look when they come in. To accomplish that, you can use polymorphism and pattern matching.

```
# MapleScript
(make factorial
  (of [1] 1)
  (of [n] (* n (factorial (- n 1)))))

# JavaScript (more or less)
const factorial = function (n) {
  if (n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
```


Notice, you've still got access to all of JavaScript's native object functionality.

```
# MapleScript
(Math.round 2.3)

# JavaScript
Math.round(2.3)
```

But when you make your own objects, things are just a little different. Objects in MapleScript are syntactically just another kind of list where each odd-numbered item represents a key and each even-numbered item represents the associated value.

```
# MapleScript
{a b c d}

# JavaScript
{a: b, c: d}
```

So in order to add some visual clarity, it's conventional to use Symbols for keys where possible (kind of like in Ruby). In MapleScript, you can reference a symbol simply by placing a colon in front of a keyword `:like-this`, for example.

```
# MapleScript
{:a b :c d}

# JavaScript
{[Symbol.for('a')]: b, [Symbol.for('c')]: d}
```

If you want to retrieve a symbol key from an object, you can use colon syntax instead of dot syntax, like so:

```
# MapleScript
(make obj { :foo 'bar' })

obj:foo

# JavaScript
const obj = { [Symbol.for('foo')]: 'bar' };

obj[Symbol.for('foo')]
```

And, as you might expect, you can mix colon and dot syntax in lots of cool ways.

```
# MapleScript
(make obj {
  :foo {
    "bar" [
      { :baz 100 }
    ]
  }
})

obj:foo.bar.0:baz

# JavaScript
const obj = {
  [Symbol.for('foo')]: {
    "bar": [
      { [Symbol.for('baz')]: 100 }
    ]
  }
};

obj[Symbol.for('foo')].bar[0][Symbol.for('baz')]
```

FYI, you can't use array notation to retrieve items from objects. That means no more `foo[0]` and a lot more `foo.0`. If you need to grab something dynamically, you use the `get` function. Like so: `(get object item)`.

But what if you're not sure if all those nodes in your nested tree are defined? You probably don't want it to throw an error if, for example, the `bar` object doesn't exist. In that case, you can use the `?` character for safety.

```
# MapleScript
(if
  a.b.c?.d?.e true
  false)

# JavaScript
if (a.b.c && a.b.c.d && a.b.c.d.e) {
  return true;
} else {
  return false;
}
```

But let's forget about tree lookups for a second and talk about DOM stuff. MapleScript provides a very nice way to create virtual DOM nodes (meaning an object tree _representing_ the DOM). Virtual nodes can be rendered into real nodes or diffed against other virtual nodes to find the differences between the two virtual trees. With those differences, you can quickly make changes to an existing real DOM.

The syntax for this is inspired by React's JSX dialect, but you don't need any extra libraries to make it work.

```
# MapleScript

# Create a custom dom node called Title
(elem Title [attrs]
  <h1 {:class attrs:class}>
    attrs:text
  </h1>
)

# Build a couple virtual instances of Title
(make vTitle1 <Title {:class 'foo' :text 'Hello world!'}/>)
(make vTitle2 <Title {:class 'foo' :text 'Goodbye world!'}/>)

# Render real dom nodes from one of our virtual titles
(make realTitle (vdom:render vTitle))

# Drop our real dom nodes into the document body
(-> (dom 'body') (@appendChild realTitle))

# Get the differences between our 2 virtual dom trees
(make changes (vdom:diff vTitle1 vTitle2))

# Use those changes to modify the real DOM. BOOM.
(vdom:patchNodes realTitle changes)

# JavaScript
... yeah, I'm not even gonna try to write an equivalent.
```

I know you're probably scratching your head a little bit at that `->` syntax. Here's the thing: chaining methods doesn't really work so well with a Lisp -

```
# JavaScript
createPromise()
  .then(result => createPromise())
  .then(result => createPromise())
  .then(result => console.log(result));

# Any Lisp's best attempt
((((createPromise).then
  (fn [result] (createPromise))).then
  (fn [result] (createPromise))).then
  (fn [result] (console.log result)))
```

Chaining off of a function call tends to mean that you end up stacking parentheses on both sides of everything. Tell me, how easily can you parse those parentheses?

To make this nicer, MapleScript includes a special form called "context chains" in which each link in the chain receives the result of the previous link as its `this` context (which can be referenced via `@` in MapleScript).

```
# MapleScript
(-> (createPromise)
    (@then (fn [result] (createPromise)))
    (@then (fn [result] (createPromise)))
    (@then (fn [result] (log result))))

# A direct JavaScript equivalent would be
var context = createPromise();
context = context.then(result => createPromise());
context = context.then(result => createPromise());
context = context.then(result => console.log(result));
```

Context chains solve another syntax problem too. Often times you'll want to call a function and pass its result to another function, then maybe even pass _that_ result to _another_ function. It looks something like this:

```
# MapleScript
(baz (bar (foo 1 2) 3 4) 5 6)

# JavaScript
baz(bar(foo(1, 2), 3, 4), 5, 6)
```

But with a context chain you can make that a heck of a lot nicer:

```
# MapleScript

(-> (foo 1 2)
    (bar @ 3 4)
    (baz @ 5 6))
```

Because the result of each function call becomes the `this` context of the next function call, everything can now be written sequentially, making it much easier to both read and write.

And while we're talking about special syntaxes, there's one more you should know about. This one is called a call chain. It solves another Lisp-specific syntax problem. In JavaScript, if the result of a function call is another function, you can call it pretty easily. But our s-expressions make it kind of annoying. Consider:

```
# JavaScript
foo(1, 2)(3, 4)(5, 6);

# The Lispy Equivalent
(((foo 1 2) 3 4) 5 6)
```

Any time you have to start stacking parentheses on the left hand side of an expression, it starts to get really annoying to write. So we usually do whatever we can to avoid it. In MapleScript, we do this:

```
# MapleScript

(>>= foo [1 2] [3 4] [5 6])

# You can also use a context chain here if you want

(-> (foo 1 2) (@ 3 4) (@ 5 6))
```

You might say that's even easier to read than the JavaScript way.

For those of you who are familiar with Haskell, `>>=` does **not** indicate a monad in MapleScript. It's just a function that expects its first argument to be a function and all subsequent arguments to be lists. It then executes the function and passes in the first list as its arguments. It assumes the result will be a function and that function is then executed with the second list as its arguments. It goes on and on to infinity if you'd like.

But let's not go on to infinity. Instead, let's talk about MapleScript's unique technique for error handling. In JavaScript, you'll usually use a `try/catch` block. In MapleScript, however, you will not. You'll use the built-in event bus.

```
# MapleScript
(make failer []
  (attempt :event-channel
    (do
      (JSON.parse 'asdfasdf'))))

(handle :event-channel
  (fn [err]
    (log err)))

(failer)

# JavaScript
function failer() {
  try {
    JSON.parse('asdfasdf');
  } catch (err) {
    eventBus.signal([Symbol.for('event-channel')], err);
  }
}

eventBus.subscribe([Symbol.for('event-channel')], function (err) {
  console.log(err);
});

failer();
```

This technique even works with async functions.

```
# MapleScript
(make failer (async :event-channel []
  (await (doSomething))
  (await (doSomething))
  (end)))

(handle :event-channel (fn [err]
  (you get the idea)))  
```

Of course, you'll probably want to run that through Babel or some such until async/await starts getting implemented natively.

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
