/**
 * External dependencies.
 */

var clone = require('clone');

/**
 * Contain the environment variables and the
 * current working directory for commands.
 *
 * @param {Object} env
 * @param {String} cwd
 * @constructor
 */

function World(env, cwd) {
  this.env = env || clone(process.env);
  this.cwd = cwd;
  this.timeout = null;
}

/**
 * Primary export.
 */

module.exports = World;
