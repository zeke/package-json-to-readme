# package-json-to-readme [![Build Status](https://travis-ci.org/zeke/package-json-to-readme.svg?branch=master)](https://travis-ci.org/zeke/package-json-to-readme)

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

```sh
npm i -g package-json-to-readme
```

## Usage

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

# If your package has an example.sh or example.js file, it will be used to
# generate a usage section like this one.

# If your example.js has a require("./") statement, the relative path will be
# replaced with the package name.
```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [github-url-to-object](https://github.com/zeke/github-url-to-object): Extract user, repo, and other interesting properties from GitHub URLs
- [hogan.js](https://github.com/twitter/hogan.js): A mustache compiler.
- [strip-ansi](https://github.com/chalk/strip-ansi): Strip ANSI escape codes
- [sync-exec](https://github.com/gvarsanyi/sync-exec): Synchronous exec with status code support. Requires no external dependencies, no need for node-gyp compilations etc.
- [yargs](https://github.com/bcoe/yargs): Light-weight option parsing with an argv hash. No optstrings attached.

## Dev Dependencies

- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [nixt](https://github.com/vesln/nixt): Simple and powerful testing for command-line apps

## License

MIT

## See Also

- [readme-md-generator](https://github.com/kefranabg/readme-md-generator), a CLI that's able to read your environment (package.json, git config...) to suggest you default answers during the README creation process.
- [mos](https://github.com/zkochan/mos), a pluggable module that injects content into your markdown files via hidden JavaScript snippets.
