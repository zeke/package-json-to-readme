#!/usr/bin/env node

var hogan = require("hogan.js")
var fs = require("fs")
var gh = require("github-url-to-object")

if (process.argv.length != 3) {
  return process.stderr.write("Usage: readme path/to/package.json")
}

var pkg = require(process.argv[2])

// Add travis URL
if (pkg.repository && pkg.repository.url && gh(pkg.repository.url)) {
  pkg.travis_url = gh(pkg.repository.url).travis_url
}

var template = hogan.compile(fs.readFileSync(__dirname + "/template.md").toString())

process.stdout.write(template.render(pkg))
