![MapleScript](https://github.com/jgnewman/maplescript/raw/master/logo.svg?sanitize=true)
> A friendlier Lisp over JavaScript.

[![Build Status](https://travis-ci.org/jgnewman/maplescript.svg?branch=master)](https://travis-ci.org/jgnewman/maplescript)

```
(make (delicious code)
  (maplescript:compile code))
```

MapleScript is an intuitive, application-focused Lisp dialect that compiles to JavaScript. The language itself contains both a built-in event system and a virtual DOM, as well as a JSX-like syntax for creating virtual nodes, all in about 24kb of minified overhead.

**Read the [official docs](https://jgnewman.github.io/maplescript/).**

# Quick Overview

> If you're not familiar with the term, Lisps are a family of languages where most things in the language look `(like this)`. Lists enclosed in parentheses are called "s-expressions".

MapleScript is different from ClojureScript (another Lisp over JavaScript) in that it has a much simpler syntax, sticks to JavaScript's native data types, and implements functionalism less rigidly.

The purpose behind MapleScript is to allow you to trade out 100kb+ libraries for a much smaller language that gives you the same core power natively. To illustrate, the MapleScript repository includes an ~8k framework called Syrup that leverages this power to help you build reactive, component-based applications with a redux-like state and lifecycle events.

Here are a few examples of things you can do in MapleScript:

```
-- Create a factorial calculator

(make (factorial n)
  (if
    (?< n 2)
      1
    (* n (factorial (- n 1)))))

-- Create a factorial calculator with pattern matching!

(make (factorial 0) 1
      (factorial n) (* n (factorial (- n 1))))

-- More easily use Symbols, especially as object keys

(make person {
  :name 'John'
  :eyes 'hazel'
  :hair 'brown'
})

person:name           =>  'John'
person:age?:birthday  =>  undefined

-- Enjoy more accurate type checking

(m:typeof {})     =>  :object
(m:typeof null)   =>  :null
(m:typeof [1 2])  =>  :array

-- Chain context between function calls

(-> (jquery '#my-div')
    (&.addClass 'my-class')
    (&.hide))

(-> (returnPromise)
    (&.then (@ [result] (returnPromise result)))
    (&.then (@ [result] (returnPromise result)))
    (&.then (@ [result] result)))

-- Use the built-in event system

(m:handle :my-event (@ [data] (m:log data)))
(m:signal :my-event 'foo')

-- Generate nodes in a virtual DOM!

(make title
  <h1 {:class 'my-class'}>
    'Hello, world!'
  </h1>
)

-- Turn them into real html nodes!

(make renderedTitle (m:vdom:render title))

-- Inject them into a web page!

(m:vdom:injectNodes renderedTitle '#target-selector')

-- Diff two versions of a virtual DOM!

(make title2
  <h1 {:class 'different-clas'}>
    'Goodbye, world!'
  </h1>
)

(make patches (m:vdom:diff ))

-- Automatically apply changes from a diff!

(m:vdom:patchNodes renderedTitle patches)
```

Plus, use it with Browserify, Gulp, and Webpack!

**Read the [official docs](https://jgnewman.github.io/maplescript/).**
