### v.0.0.6-a

- Adds 2 new library functions:
  - `(m:contains data value)` - Determines whether `value` is contained in `data` where `data` is a string or an array. For example, `(m:contains ['a' 'b' 'c'] 'b') => true`
  - `(m:hasKey obj key)` - Determines whether an object `obj` owns a key `key`. For example `(m:hasKey {:foo 'bar'} :foo) => true`
- Removes some unneeded compiler complexity

### v.0.0.5-a

- Fix a string interpolation bug where we got unexpected results when the string began with an interpolation block.
- Various clarifications in the docs.
- Docs are now more mobile responsive.
- Removed some extraneous compile code leftover from old techniques.

### v.0.0.4-a

Contains significant syntax changes designed to boos readability and declutter the keyword space.. This version is **not** compatible with previous versions.

- `#` no longer denotes a comment. Use `--` instead.
- `### ... ###` no longer denotes a comment. Use `--- ... ---` instead (like Yaml frontmatter).
- `@` no longer denotes `this`. Use `&` instead.
- `fn` no longer denotes an anonymous function. Use `@` instead. More specifically, `(@ [x] (+ x x))`.
- `make` must take an even number of arguments. If you are defining a function with multiple commands, wrap them up in a `do` block.
- `make` plays into new syntax for polymorphic functions. Every odd numbered argument is a pattern and every even numbered argument is the command the pattern represents. More specifically, rather than `(make f (of [x] y) (of [x x] z))`, the new syntax is `(make (f x) y (f x x) z)`. As such, the `of` form has been removed.
- `element` special form has been removed. Define a normal function instead.
- `args` no longer denotes arguments in the form of an array. Instead, a reference to `arguments` will return an arrayified version of the arguments object. This avoids adding an extra keyword as well as creating a lot of unnecessary argument arrays. This means expressions such as `(arguments.forEach foo)` and `(m:map arguments foo)` will now work.
- Includes multiple tweaks to boost efficiency and reduce file size.
