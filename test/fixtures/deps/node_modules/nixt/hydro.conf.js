/**
 * External dependencies.
 */

var join = require('path').join;

/**
 * Internal dependencies.
 */

var nixt = require('./');

/**
 * Nixt template that has the fixtures dir as a CWD.
 *
 * @returns {Object}
 * @api public
 */

function nfixt() {
  return nixt().cwd(join(__dirname, 'test', 'fixtures'));
}

/**
 * Test setup.
 *
 * @param {Object} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.set({
    formatter: 'hydro-dot',
    globals: {
      nfixt: nfixt,
    },
    chai: {
      styles: 'should',
      stack: true,
    },
    tests: [
      'test/*.test.js'
    ],
    plugins: [
      'hydro-chai',
      'hydro-bdd',
    ],
  });
};
