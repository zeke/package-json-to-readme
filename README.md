# package-json-to-readme [![Build Status](https://travis-ci.org/VOID404/package-json-to-readme.svg?branch=master)](https://travis-ci.org/VOID404/package-json-to-readme)

Generate a README.md from package.json contents. Works with node and io.js.

## Why?

Every project worth its salt has a README that answers (at least) the following questions:

- What's it called?
- What is it for?
- How do I install it?
- How do I use it?
- How do I test it?
- What is the license?

With npm modules, most of that info can be gleaned from properties in the `package.json` file: `name`, `description`, `scripts.test`, `preferGlobal`, etc. That's why `package-json-to-readme` exists. Use it to generate a decent boilerplate README, then iterate from there.

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install package-json-to-readme --global
```

## Usage

If your package has an `usage.md` file, it will be used to
generate a usage section like this one. If package contains
 an `example.sh` or `example.js` file, it will also be added.

If your `example.js` has a `require("./")` statement, the relative path will be
replaced with the package name.

```sh
# Write to stdout
readme package.json

# Pipe output into a new file
readme package.json > README.md

# Add a Travis badge
readme package.json --travis

# Run tests and add their output
readme package.json --tests

# Do it all
readme package.json --tests --travis > README.md

```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [github-url-to-object](https://github.com/zeke/github-url-to-object): Extract user, repo, and other interesting properties from GitHub URLs
- [hogan.js](https://github.com/twitter/hogan.js): A mustache compiler.
- [strip-ansi](https://github.com/sindresorhus/strip-ansi): Strip ANSI escape codes
- [sync-exec](https://github.com/gvarsanyi/sync-exec): Synchronous exec with status code support. Requires no external dependencies, no need for node-gyp compilations etc.
- [yargs](https://github.com/bcoe/yargs): Light-weight option parsing with an argv hash. No optstrings attached.

## Dev Dependencies

- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [nixt](https://github.com/vesln/nixt): Simple and powerful testing for command-line apps


## License

MIT

## Colophon

- Homepage: https://github.com/zeke/package-json-to-readme
- Author: Zeke Sikelianos <zeke@sikelianos.com> (http://zeke.sikelianos.com/)
- README generated by
[package-json-to-readme](https://github.com/zeke/package-json-to-readme)

## See Also

- [mos](https://github.com/zkochan/mos), a pluggable module that injects content into your markdown files via hidden JavaScript snippets.
