{{#travis_url}}[![Build Status]({{travis_url}}.png?branch=master)]({{travis_url}}){{/travis_url}}

## Installation

{{#usage}}
## Usage

```{{language}}
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
{{#testOutput}}
```
{{{testOutput}}}
```
{{/testOutput}}

## Dependencies

{{#depDetails}}
- [{{name}}]({{repository.url}}): {{description}}
{{/depDetails}}
{{^depDetails}}
None
{{/depDetails}}

## Dev Dependencies

{{#devDepDetails}}
- [{{name}}]({{repository.url}}): {{description}}
{{/devDepDetails}}

{{^devDepDetails}}
None
{{/devDepDetails}}

## License
