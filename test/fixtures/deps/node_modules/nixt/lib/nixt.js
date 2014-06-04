/**
 * Primary export.
 */

module.exports = require('./nixt/runner');

/**
 * Plugin support.
 */

module.exports.register = require('./nixt/plugin');

/**
 * Module version.
 */

module.exports.version = require('../package.json').version;
