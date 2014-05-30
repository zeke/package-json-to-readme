#!/usr/bin/env node

var hogan = require("hogan.js")
var fs = require("fs")
var argv = require('minimist')(process.argv.slice(2))
var gh = require("github-url-to-object")

if (!argv._.length) {
  return console.error("Usage: readme path/to/package.json")
}

try {
  var pkg = require(process.argv[2])
} catch(e) {
  return console.error("Invalid JSON file: %s", process.argv[2])
}

if (argv.travis) {
  if (pkg.repository && pkg.repository.url && gh(pkg.repository.url)) {
    pkg.travis_url = gh(pkg.repository.url).travis_url
  } else {
    return console.error("`repository.url` must be a GitHub repository URL for Travis to work")
  }
}

var template = hogan.compile(fs.readFileSync(__dirname + "/template.md").toString())

process.stdout.write(template.render(pkg))
