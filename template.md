# {{name}} {{#travis_url}}[![Build Status]({{travis_url}}.png?branch=master)]({{travis_url}}){{/travis_url}}

{{description}}

{{#homepage}}
{{homepage}}
{{/homepage}}

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
{{#preferGlobal}}
npm install {{name}} --global
{{/preferGlobal}}
{{^preferGlobal}}
npm install {{name}} --save
{{/preferGlobal}}
```

{{#usage}}
## Usage

```{{lang}}
{{{content}}}
```
{{/usage}}

{{#scripts.test}}
## Tests

```sh
npm install
npm test
```
{{/scripts.test}}

{{#license}}
## License

{{license}}

{{author}}
{{/license}}
