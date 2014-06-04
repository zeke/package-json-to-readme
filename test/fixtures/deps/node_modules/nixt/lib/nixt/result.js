/**
 * Simple object that contains the result
 * of command executions.
 *
 * @constructor
 */

function Result(cmd, options) {
  options = options || {};
  this.options = options;
  this.cmd = cmd;
}

/**
 * Normalize the command-line result.
 *
 * @param {String} stdout
 * @param {String} stderr
 * @returns {Result} self
 * @api public
 */

Result.prototype.parse = function(stdout, stderr, err) {
  this.err = err;
  this.code = err ? err.code : 0;
  this.killed = err && err.killed;
  this.stdout = this.strip(stdout);
  this.stderr = this.strip(stderr);
  return this;
};

/**
 * `Result#strip` will do the following:
 *
 * - Remove the last new line symbol from the string (always)
 * - Strip new lines (optional, see `options`)
 * - Strip colors (optional, see `options`)
 *
 * Acknowledgments:
 *
 *  - StripColorCodes - MIT License
 *
 * @param {String} str
 * @returns {String}
 * @api private
 */

Result.prototype.strip = function(str) {
  str = str.replace(/\r?\n$/, '');

  if (this.options.newlines === false) {
    str = str.replace(/\r?\n/g, '');
  }

  if (this.options.colors === false) {
    str = str.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
  }

  return str;
};

/**
 * Primary export.
 */

module.exports = Result;
