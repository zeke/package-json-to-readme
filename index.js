#!/usr/bin/env node
'use strict'

var hogan = require('hogan.js')
var fs = require('fs')
var path = require('path')
var util = require('util')
var argv = require('yargs')
  .usage('Usage: readme path/to/package.json')
  .check(function (argv) {
    if (!argv._.length) throw new Error('A path to a valid package.json is required')
    return true
  })
  .option('r', {
    alias: 'travis',
    description: 'display a travis badge'
  })
  .option('t', {
    alias: 'test',
    description: 'include test output in readme'
  })
  .alias('t', 'tests')
  .help('help')
  .alias('h', 'help')
  .argv
var gh = require('github-url-to-object')
var execSync = require('sync-exec')
var stripAnsi = require('strip-ansi')

var pkgPath = path.resolve(process.cwd(), argv._[0])

try {
  var pkg = require(pkgPath)
} catch (e) {
  console.error('Invalid JSON file: %s', pkgPath)
  process.exit()
}

pkg.private = pkg.private || pkg.license === 'private' || false

if (argv.travis) {
  if (pkg.repository && pkg.repository.url && gh(pkg.repository.url)) {
    pkg.travis_url = gh(pkg.repository.url).travis_url
  } else {
    console.error('`repository.url` must be a GitHub repository URL for Travis to work')
    process.exit()
  }
}

// Run tests and fetch output
if (argv.tests || argv.test) {
  pkg.testOutput = stripAnsi(execSync('npm test').stdout)
    .replace(/\r/g, '') // remove weird newlines
    .replace(/\n+/g, '\n') // remove excess newlines
}

// Look for example.js or example.sh in package.json directory
var extensions = ['js', 'sh']
extensions.forEach(function (language) {
  var exampleFile = path.resolve(path.dirname(argv._[0])) + '/example.' + language
  if (fs.existsSync(exampleFile)) {
    pkg.usage = {
      language: language,
      content: fs.readFileSync(exampleFile).toString()
    }

    // replace require('./') statement with the package name
    if (language === 'js') {
      pkg.usage.content = pkg.usage.content.replace(
        /require\(['"]?\.\/['"]?\)/,
        util.format('require("%s")', pkg.name)
      )
    }
  }
})

var getDeps = function (deps) {
  return Object.keys(deps).map(function (depname) {
    var dep = require(path.resolve(path.dirname(argv._[0])) + '/node_modules/' + depname + '/package.json')
    dep.repository = 'https://ghub.io/' + depname
    return dep
  })
}

if (pkg.dependencies) pkg.depDetails = getDeps(pkg.dependencies)
if (pkg.devDependencies) pkg.devDepDetails = getDeps(pkg.devDependencies)

var templatePath = path.join(__dirname, 'template.md')
var template = hogan.compile(fs.readFileSync(templatePath).toString())

process.stdout.write(template.render(pkg))
