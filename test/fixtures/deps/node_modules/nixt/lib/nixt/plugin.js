/**
 * Internal dependencies.
 */

var Runner = require('./runner');

/**
 * Primitive plugin support.
 *
 * It will add the supplied `fn to Runner's prototype.
 *
 * Examples:
 *
 * Register a single function, could be both middleware or expectation:
 *
 *    nixt.register('stdoutNotEqual', fn);
 *
 * Later on this can be used as you would expect:
 *
 *    nixt()
 *    .run('ls /tmp')
 *    .stdoutNotEqual('xxx')
 *    .end()
 *
 * In case you want to register more than one function at once you may want to pass
 * an object:
 *
 *    nixt.register({
 *      name: fn,
 *      otherName: fn2,
 *      etc: etc,
 *    });
 *
 * The second example might come handy when developing plugins. Keep in mind that
 * the plugin system will most certainly change in future version (prior hitting 1.0.0).
 * The current implementation has some obvious problems like what plugin developers
 * will do if they happen to use the same function name. Any ideas and suggestions
 * are more than welcome.
 *
 * @param {String|Object} name
 * @param {Function} fn
 * @api public
 */

module.exports = function(name, fn) {
  var reg = null;

  if (Object(name) !== name) {
    reg = Object.create(null);
    reg[name] = fn;
  } else {
    reg = name;
  }

  Object.keys(reg).forEach(function(key) {
    Runner.prototype[key] = reg[key];
  });
};
