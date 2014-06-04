[![NPM version](https://badge.fury.io/js/nixt.png)](http://badge.fury.io/js/nixt)
[![Build Status](https://secure.travis-ci.org/vesln/nixt.png)](http://travis-ci.org/vesln/nixt)

![Nixt](http://i.imgur.com/aBudpSE.jpg)

## Synopsis

Simple and powerful end-to-end testing for command-line apps.

## Description

Nixt is aiming to make testing of command-line apps as simple as possible. It
plays nice with the testing tools that you are already using and in case you are
one of those guys who practice outside-in BDD, it has the potential to become
something that lives in every command-line app that you are going to build.

### How it looks

```js
var nixt = require('nixt');

nixt()
.touch('/tmp/test')
.run('ls /tmp/')
.stdout(/test/)
.end();
```

### Formatting options

Nixt can strip newlines and colors. You can tell it to do so by passing an
object that looks like this:

```js
var options = {
  colors: false,
  newlines: false,
};

nixt(options).stdout...
```

### Custom expectations

While Nixt comes with built-in expectations, you can use your own too.

```js
nixt()
.expect(function(result) {
  if (result.stdout !== 'unicorns') {
    return new Error('NO!');
  }
})
.run('unicorns')
.end(fn);
```

### Custom middlewares

You can register as many before and after middlewares as you wish.

```js
nixt()
.before(setupDatabase)
.before(runMigrations)
.run(cmd)
.after(downgradeCron)
.after(deleteDatabase)
.end();
```

### Middleware order

The Middleware execution order is very simple - "before" middlewares always run
before everything else, "after" middlewares always run after everything else.
The other middlewares will match the order that you have specified.

```js
nixt()
.before(before1)
.before(before2)
.after(after1)
.after(after2)
.touch(file)
.run(cmd)
.unlink(file)
.end(fn)

// Execution order:
// before1, before2, touch, cmd, unlink, after1, after2
```

You may also want to reuse before and after middlewares as much as possible,
especially when testing something that requires extensive setup and cleanup. You
can accomplish this by cloning a Nixt instance.

```js
var base = nixt()
  .before(setupDatabase)
  .after(removeDatabase);

// Later on

base.clone().run....
```

### Plugins

Nixt has primitive support for plugins. You can register any expectation or/and
any middleware by calling `nixt.register`.

```js
var fn = function() {};
nixt.register('foo', fn);
```

Or you may want to register many functions at once.

```js
var fn = function() {};
var fn1 = function() {};
nixt.register({ baz: fn, bar: fn1 });
```

### Usage with a test runner

Nixt plays nice with any test runner out there. Here is a minimal example how
you could use it with Mocha.

```js
describe('todo add', function() {
  it('adds a new todo item', function(done) {
    nixt()
    .run('todo add')
    .stdout('A new todo has been added')
    .end(done);
  });
});
```

### Usage without a test runner

While using a test runner is recommended nixt is completely 'nodeable'. Here is
a simple example how you could accomplish that:

```js
var assert = require('assert');

function refute(err) {
  assert(!err);
}

nixt()
.run(cmd)
.end(refute);

nixt()
.run(anotherCmd)
.end(refute);
```

## API

### #before

Register a "before" middleware.

```js
nixt()
.before(fn)
.before(fn2)
.run(cmd)
.end();
```

### #after

Register an "after" middleware.

```js
nixt()
.run(cmd)
.after(fn)
.after(fn2)
.end();
```

### #cwd

Change the current working directory of the main command (specified with `run`).
Please not that this won't affect any other commands like `unlink` etc.

```js
nixt()
.cwd(path.join(__dirname, 'node_modules', '.bin'))
.run('mocha --version')
.stdout('1.13.0')
.end();
```

### #base

Set a base command. Useful for templates.

```js
nixt()
.cwd(path.join(__dirname, 'node_modules', '.bin'))
.base('mocha ')
.run('--version')
.stdout('1.13.0')
.end();
```

### #run

Set a primary command to execute:

```js
nixt()
.run('node --version')
.stdout('0.10.16')
.end(fn);
```

You could also run the test right after specifying the command to run:

```js
nixt()
.stdout('0.10.16')
.run('node --version', fn)
```

### #env

Set environment variables.

```js
nixt()
.env('foo', 'bar')
.env('baz', 'boo')
.run('node --version')
.stdout('0.10.16')
.end(fn);
```

### #timeout

Set a timeout for the main command that you are about to test.

```js
nixt()
.timeout(1) // ms
.run('cat /dev/null')
.end(fn);
```

### #stdout

Set expectations on stdout.

```js
nixt()
.stdout('LICENSE Makefile')
.run('ls')
.end(fn);
```

Works with regular expressions too.

```js
nixt()
.stdout(/system/)
.run('time')
.end(fn);
```

### #stderr

Same as `stdout` but well.. surprise works with stderr.

```js
nixt()
.run('todo add')
.stderr('Please speicfy a todo')
.end(fn);
```

### #code

Expect a given exit code.

```js
nixt()
.run('todo add')
.code(1)
.end(fn);
```

### #exist

Check if a given path exists (works with both files and directories).

```js
nixt()
.run('mkdir /tmp/test')
.exist('/tmp/test')
.end(fn);
```

### #match

Check the contents of a file.

```js
nixt()
.writeFile(file, 'Hello')
.run('node void.js')
.match(file, 'Hello')
.unlink(file)
.end(done);
```

```js
nixt()
.writeFile(file, 'Hello')
.run('node void.js')
.match(file, /ello/)
.unlink(file)
.end(done);
```

### #mkdir

Create a new directory.

```js
nixt()
.mkdir('xml-database')
.run('this does stuff with the xml-database directory')
.end(fn);
```

### #exec

Execute a given command.

```js
nixt()
.touch('LICENSE')
.exec('git add -a')
.exec('git commit -m "Add LICENSE"')
.run('git log')
.stdout(/LICENSE/)
.end();
```

By default the commands will inherit the "world" for the main command which
includes environment variables, cwd, timeout. However, you can override this by
supplying a different "world":

```js
nixt()
.exec('git add LICENSE', { timeout: 4, cwd: '/tmp' })
.run('git log')
.stdout(/LICENSE/)
.end();
```

### #writeFile

Create a file with or without given contents.

Without:

```js
nixt()
.writeFile(pathToFile)
.end();
```

With:

```js
nixt()
.writeFile(pathToFile, data)
.end();
```

### #rmdir

Remove a directory.

```js
nixt()
.mkdir('xml-database')
.run('this does stuff with the xml-database directory')
.rmdir('xml-database')
.end(fn);
```

### #unlink

Unlink a file.

```js
nixt()
.touch('my-file')
.run('this does stuff with my file')
.unlink('my-file')
.end(fn);
```

### #end

Run the given test.

```js
nixt()
.run('ls')
.stdout('this-is-not-porn-i-promise')
.end(function(err) {

});
```

The same might be accomplished with supplying a function to `run`:

```js
nixt()
.stdout('this-is-not-porn-i-promise')
.run('ls', function(err) {

})
```

### #clone

Deep clone a Nixt instance.

```js
var clone = nixt()
.before(fn)
.after(fn)
.run('my awesome command')
.end()
.clone();
```

### #expect

Register a custom expectation.

```js
nixt()
.expect(function(result) {
  if (result.stdout !== 'Unicorns') {
    return new Error('OMG');
  }
})
.run('ls')
.end(fn);
```

## Installation

```bash
$ npm install nixt
```

## Tests

### Running the tests

```bash
$ make
```

## Credits

Special thanks to:

  - [Alexander Petkov](https://dribbble.com/apetkov) - logo design
  - [Martin Lazarov](https://github.com/mlazarov) - various ideas
  - [Radoslav Stankov](https://github.com/rstankov)

## Support the author

Do you like this project? Star the repository, spread the word - it really helps. You may want to follow
me on [Twitter](https://twitter.com/vesln) and
[GitHub](https://github.com/vesln). Thanks!

## License

**MIT License**

Copyright (C) 2013 Veselin Todorov (hi@vesln.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
