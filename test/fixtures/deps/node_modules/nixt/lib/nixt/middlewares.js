/**
 * Core dependencies.
 */

var exec = require('child_process').exec;
var fs = require('fs');

/**
 * Asynchronous mkdir(2).
 *
 * @param {String} path
 * @returns {Function} middleware
 * @see fs#mkdir
 * @api public
 */

exports.mkdir = function(path) {
  return function(next) {
    fs.mkdir(path, done(next));
  };
};

/**
 * Asynchronously writes data to a file, replacing the file if it already exists.
 * `data` can be a string or a buffer.
 *
 * @param {String} path
 * @param {Buffer|String} data
 * @returns {Function} middleware
 * @see fs#writeFile
 * @api public
 */

exports.writeFile = function(path, data) {
  return function(next) {
    fs.writeFile(path, data, done(next));
  };
};

/**
 * Asynchronous rmdir(2).
 *
 * @param {String} path
 * @returns {Function} middleware
 * @see fs#rmdir
 * @api public
 */

exports.rmdir = function(path) {
  return function(next) {
    fs.rmdir(path, done(next));
  };
};

/**
 * Asynchronous unlink(2).
 *
 * @param {String} path
 * @returns {Function} middleware
 * @see fs#unlink
 * @api public
 */

exports.unlink = function(path) {
  return function(next) {
    fs.unlink(path, done(next));
  };
};

/**
 * Run a command in a shell.
 *
 * @param {String} the command to run
 * @param {String} cwd
 * @returns {Function} middleware
 * @see child_process#exec
 * @api public
 */

exports.exec = function(cmd, world) {
  return function(next) {
    exec(cmd, world, next);
  };
};

/**
 * Callback generator for middlewares. Throw errors if any.
 *
 * @param {Function} next
 * @returns {Function}
 * @api public
 */

function done(next) {
  return function(err) {
    if (err) throw err;
    next();
  };
}
