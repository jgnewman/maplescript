# Pine
> A friendlier Lisp over JavaScript.

## What is a Lisp?

Lisp is a family of programming languages where the most distinctive feature is that all expressions are structured as lists enclosed in parentheses.

## Isn't ClojureScript already a Lisp over JavaScript? Why make another one?

ClojureScript is awesome. But it's also big and heavy because it tries to implement as much of the full Clojure language as possible. It has a lot of features that, while cool, aren't really necessary and can slow things down.

Pine, on the other hand, is extremely light-weight and focuses on applying functionalism to JavaScript without too much unfamiliarity. Like CoffeeScript, it has relatively minimal overhead and contains many similar benefits.

## What are some of Pine's distinguishing features?

1. You get polymorphic functions with pattern matching and argument destructuring!
2. There is a native syntax for building DOM nodes, similar to JSX but baked right in!
3. The syntax is clear and intuitive, and makes heavy use of ES6 Symbols.

## Can I see some examples?

Sure! In the following examples, I'll give you the Pine code and include the equivalent JavaScript to help you get a feel for what's going on.

In Pine, everything is structured like a function call, and function calls look like this:

```
# Pine
(function_to_call arg1 arg2)

# JavaScript
function_to_call(arg1, arg2)
```

It's just a list wrapped in parentheses where the first list item is a function to call and each subsequent item is an argument to pass in.

Even math is done this way!

```
# Pine
(+ 2 3 4)

# JavaScript
2 + 3 + 4
```

And the most important function to learn about in Pine is `make` because it's what you'll use to define almost _everything_:

```
# Pine
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
# Pine
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
# Pine
(Math.round 2.3)

# JavaScript
Math.round(2.3)
```

But when you make your own objects, things are just a little different. Objects in Pine are syntactically just another kind of list where each odd-numbered item represents a key and each even-numbered item represents the associated value.

```
# Pine
{a b c d}

# JavaScript
{a: b, c: d}
```

So in order to add some visual clarity, it's conventional to use Symbols for keys where possible (kind of like in Ruby). In Pine, you can reference a symbol simply by placing a colon in front of a keyword `:like_this`, for example.

```
# Pine
{:a b :c d}

# JavaScript
{[Symbol.for('a')]: b, [Symbol.for('c')]: d}
```

If you want to retrieve a symbol key from an object, you can use colon syntax instead of dot syntax, like so:

```
# Pine
(make obj { :foo 'bar' })

obj:foo

# JavaScript
const obj = { [Symbol.for('foo')]: 'bar' };

obj[Symbol.for('foo')]
```

And, as you might expect, you can mix colon and dot syntax in lots of cool ways.

```
# Pine
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

But what if you're not sure if all those nodes in your nested tree are defined? You probably don't want it to throw an error if, for example, the `bar` object doesn't exist. In that case, you can use the `?` character for safety.

```
# Pine
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

But let's forget about tree lookups for a second and talk about HTML. Pine provides a very nice way to create DOM nodes. The syntax is inspired by React's JSX dialect, but you don't need any extra libraries to make it work.

```
# Pine
(elem Title [attrs]
  <h1 {:class attrs:class}>
    attrs:text
  </h1>
)

(-> (dom 'body')
    (@appendChild <Title {:class "foo" :text "Hello, world!"} />))

# JavaScript
function Title(attrs) {
  const h1 = document.createElement('h1');
  h1.setAttribute('class', attrs[Symbol.for('class')]);
  const text = document.createTextNode(attrs[Symbol.for('text')]);
  h1.appendChild(text);
  return h1;
}

document.querySelector('body').appendChild(Title({
  [Symbol.for('class')]: "foo",
  [Symbol.for('text')]: "Hello, world!"
}));
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

Chaining off of a function call tends to mean that you end up stacking parentheses on both sides of everything. Tell me, how easily can you read (much less write) those parentheses?

To make this nicer, Pine includes a special form called "chain syntax" in which each link in the chain receives the result of the previous link as its `this` context (which can be referenced via `@` in Pine).

```
# Pine
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

## How to Use It

### Directly

```javascript
import { compile, compileCode } from 'pine';

compile('path/to/file.pine', (err, result) => {
  if (err) throw err;
  fs.writeFileSync('path/to/output.js', result);
})

// or...

const javascript = compileCode("(make x 4)");
```

### As a webpack loader

```javascript
import pine from 'pine/plugins/webpack';

// ...in the config...

{
  module: {
    loaders: [
      { test: /\.pine$/, loader: pine },
    ]
  }
}
```

### In a gulp task

```javascript
import gulp from 'gulp';
import { log } from 'gulp-util';
import pine from 'pine/plugins/gulp';

gulp.task('pine', () => {
  gulp.src('./src/*.pine')
    .pipe(pine().on('error', log))
    .pipe(gulp.dest('./public/'));
});
```

### With Browserify

```javascript
import gulp from 'gulp';
import browserify from 'browserify';
import pineify from 'pine/plugins/browserify';
import source from 'vinyl-source-stream'; // <- standard re-gulpification

gulp.task('pine', function () {
  return browserify({entries: ['/path/to/entry.pine'], extensions: ['.pine']})
         .transform(pineify)
         .bundle()
         .pipe(source('app.js'))
         .pipe(gulp.dest('path/to/output_directory'));
});
```
