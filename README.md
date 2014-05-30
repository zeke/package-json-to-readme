# package-json-to-readme [![Build Status](https://travis-ci.org/zeke/package-json-to-readme.png?branch=master)](https://travis-ci.org/zeke/package-json-to-readme)

Generate a README.md from package.json contents

https://github.com/zeke/package-json-to-readme

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install package-json-to-readme --global
```

## Usage

Write to `stdout`:

```sh
readme package.json
```

Pipe output into a new file:

```sh
readme package.json > README.md
```

Add a Travis badge:

```sh
readme package.json --travis > README.md
```

## Tests

```sh
npm install
npm test
```

## License

MIT

Zeke Sikelianos &lt;zeke@sikelianos.com&gt; (http://zeke.sikelianos.com/)
