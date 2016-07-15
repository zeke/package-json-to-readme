#!/usr/bin/env node
'use strict';

var hogan = require("hogan.js")
var fs = require("fs")
var path = require("path")
var util = require("util")
var argv = require('yargs')
  .usage('Usage: readme path/to/package.json')
  .check(function(argv) {
    if (!argv._.length) throw 'A path to a valid package.json is required';
    return true;
  })
  .option('r', {
    alias: 'travis',
    description: 'display a travis badge'
  })
  .option('t', {
    alias: 'test',
    description: 'include test output in readme'
  })
  .option('n', {
    alias: 'no-footer',
    description: 'disable the promotional footer message'
  })
  .alias('t', 'tests')
  .help('help')
  .alias('h', 'help')
  .argv;
var gh = require("github-url-to-object")
var execSync = require('sync-exec');
var stripAnsi = require('strip-ansi');

var pkgPath = path.resolve(process.cwd(), argv._[0])

try {
  var pkg = require(pkgPath)
} catch(e) {
  return console.error("Invalid JSON file: %s", pkgPath)
}

pkg.private = pkg.private || pkg.license === "private" || false;

if (argv.travis) {
  if (pkg.repository && pkg.repository.url && gh(pkg.repository.url)) {
    pkg.travis_url = gh(pkg.repository.url).travis_url
  } else {
    return console.error("`repository.url` must be a GitHub repository URL for Travis to work")
  }
}

// Run tests and fetch output
if (argv.tests || argv.test) {
  pkg.testOutput = stripAnsi(execSync('npm test').stdout)
    .replace(/\r/g, "")     // remove weird newlines
    .replace(/\n+/g, "\n"); // remove excess newlines
}

// Look for example.js or example.sh in package.json directory
["js", "sh"].forEach(function(language){

  var exampleFile = path.resolve(path.dirname(argv._[0])) + "/example." + language;
  if (fs.existsSync(exampleFile)) {
    pkg.sample = {
      language: language,
      content: fs.readFileSync(exampleFile).toString()
    }

    // replace require('./') statement with the package name
    if (language === "js") {
      pkg.sample.content = pkg.sample.content.replace(
        /require\(['"]?\.\/['"]?\)/,
        util.format("require(\"%s\")", pkg.name)
      )
    }

  }
})
var usageFile = path.resolve(path.dirname(argv._[0])) + "/usage.md";
if (fs.existsSync(usageFile)) {
  pkg.usage = fs.readFileSync(usageFile).toString()
}

// Disable generated-by footer with --no-footer
pkg.footer = argv['footer'] !== false

var getDeps = function(deps) {
  return Object.keys(deps).map(function(depname){
    var dep = require(path.resolve(path.dirname(argv._[0])) + "/node_modules/" + depname + "/package.json")
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
