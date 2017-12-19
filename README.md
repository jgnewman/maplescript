# Pine
> A friendlier Lisp over JavaScript.

## What is a Lisp?

Lisp is a family of programming languages where the most distinctive feature is that all expressions are structured as lists enclosed in parentheses.

## Isn't ClojureScript already a Lisp over JavaScript? Why make another one?

ClojureScript is awesome. But it's also big and heavy because it tries to implement as much of the full Clojure language as possible. It has a lot of features that, while cool, aren't really necessary and can slow things down.

Pine, on the other hand, is extremely light-weight, and focuses on applying functionalism to JavaScript without too much unfamiliarity. Like CoffeeScript, it has minimal overhead and contains many similar benefits.

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

And the most important function to learn about in Pine is `make` because it's what you'll use to define _everything_:

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

Polymorphism works really nicely with recursion as well:

```
# Pine
(make map
  (of [arr fun] (map arr fun []))
  (of [[] _ accum] accum)
  (of [[head|tail] fun accum]
    (map tail fun (accum.concat (fun head)))))

# JavaScript (more or less)
const map = function (arr, fun, accum) {
  if (!accum) {
    return map(arr, fun, []);
  } else if (!arr.length) {
    return accum;
  } else {
    const head = arr[0];
    const tail = arr.slice(1);
    return map(tail, fun, accum.concat(fun(head)));
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

But when you make your own objects, they look a little different. Objects in Pine are syntactically just another kind of list where each even-numbered index represents a key and each odd-numbered index represents the associated value.

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
(make myDiv <div {:id 'foo' :class 'bar'}>'Hello!'</div>)
(make body (dom 'body'))
(body.append myDiv)

# JavaScript
const myDiv = document.createElement('div');
myDiv.setAttribute('id', 'foo');
myDiv.setAttribute('class', 'bar');
myDiv.appendChild(document.createTextNode('Hello'));
const body = document.querySelector('body');
body.append(myDiv);
```
