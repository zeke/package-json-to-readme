#!/usr/bin/env node
'use strict';

var hogan = require("hogan.js")
var fs = require("fs")
var path = require("path")
var util = require("util")
var argv = require('minimist')(process.argv.slice(2))
var gh = require("github-url-to-object")
var execSync = require("exec-sync");
var stripAnsi = require('strip-ansi');

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

// Run tests and fetch output
if (argv.tests || argv.test) {
  pkg.testOutput = stripAnsi(execSync('npm test'))
    .replace(/\r/g, "")     // remove weird newlines
    .replace(/\n+/g, "\n"); // remove excess newlines
}

// Look for example.js or example.sh in package.json directory
["js", "sh"].forEach(function(language){

  var exampleFile = path.resolve(path.dirname(process.argv[2])) + "/example." + language;
  if (fs.existsSync(exampleFile)) {
    pkg.usage = {
      language: language,
      content: fs.readFileSync(exampleFile).toString()
    }

    // replace require('./') statement with the package name
    if (language === "js") {
      pkg.usage.content = pkg.usage.content.replace(
        /require\(['"]?\.\/['"]?\)/,
        util.format("require(\"%s\")", pkg.name)
      )
    }

  }
})

var getDeps = function(deps) {
  return Object.keys(deps).map(function(depname){
    var dep = require(path.resolve(path.dirname(process.argv[2])) + "/node_modules/" + depname + "/package.json")
    if (dep.repository && dep.repository.url && gh(dep.repository.url)) {
      dep.repository.url = gh(dep.repository.url).https_url
    }
    return dep
  })
}

if (pkg.dependencies) pkg.depDetails = getDeps(pkg.dependencies);
if (pkg.devDependencies) pkg.devDepDetails = getDeps(pkg.devDependencies);

var template = hogan.compile(fs.readFileSync(__dirname + "/template.md").toString())

process.stdout.write(template.render(pkg))
