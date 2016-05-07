#!/usr/bin/env node
'use strict';

var mos = require('mos')
var createAst = require('./lib/create-ast')
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
  .option('b', {
    alias: 'badges',
    description: 'include the listed badges'
  })
  .array('b')
  .alias('b', 'shields')
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

var badges = argv.badges || []
if (argv.travis && badges.indexOf('travis') === -1) {
  badges.push('travis')
}
pkg.badges = JSON.stringify(badges)

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

// Disable generated-by footer with --no-footer
pkg.footer = argv['footer'] !== false

var ast = createAst(pkg)
mos().process(ast, { filePath: pkgPath })
  .then(md => process.stdout.write(md))
  .catch(err => {
    console.error(err)
    process.exit(1);
  })
