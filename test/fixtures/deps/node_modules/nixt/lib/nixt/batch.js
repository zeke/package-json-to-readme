/**
 * Batch - maintain the registered middlewares & expectations.
 *
 * `Batch` is being used by `Runner`. The main role of it is to
 * maintain the correct order of the registered middlewares and the expectations.
 *
 * In order to support "templates" `Batch` tries to encapsulate the mechanics
 * behind that. There are a few rules that one should keep in mind:
 *
 * - `addBefore` always adds at the end of the 'before' list
 * - `addAfter` always adds at the end of the 'after' list
 * - `add` adds either after the before list or before the after list depending if a "main"
 *   function has been registered or not.
 *
 * The following example will (hopefully) illustrate how this class works:
 *
 *    var batch = new Batch;
 *    batch.addBefore(before1) --> execution order [before1]
 *    batch.addBefore(before2) --> execution order [before1, before2]
 *    batch.addAfter(after1)   --> execution order [before1, before2, after1]
 *    batch.add(fn1)           --> execution order [before1, before2, fn1, after1]
 *    batch.main(main)         --> execution order [before1, before2, fn1, main, after1]
 *    batch.add(fn2)           --> execution order [before1, before2, fn1, main, fn2, after1]
 *    batch.add(before3)       --> execution order [before1, before2, before3, fn1, main, fn2, after1]
 *
 *
 * So why is this even useful? It's useful when you want to implement some sort of a template.
 * Imagine the following case - you always want to perform "setup" and "teardown" for some
 * app. In this particular case we'll discuss "todo" (npm install todo). Todo works with a simple
 * json file which happens to be its database. So if you were testing it you would want to start
 * with a clean state each and every time. Here is how you could accomplish that:
 *
 *    var todo = nixt()
 *      .before(createBlankDatabase);
 *      .after(removeTheDatabase);
 *
 * Now you can put this in a helper function for your tests:
 *
 *    function todoApp() {
 *      return todo.clone();
 *    }
 *
 * And now every time when you need to create a new instance you can do so by calling the simple
 * helper method that you have created. Of course there are many ways to accomplish the same, but
 * nixt gives you the ability to keep everything simple.
 *
 * @constructor
 */

function Batch() {
  this.before = [];
  this.afterBefore = [];
  this.after = [];
  this.beforeAfter = [];
  this.fn = null;
}

/**
 * Push `fn` into the before list.
 *
 * @param {Function} fn
 * @api public
 */

Batch.prototype.addBefore = function(fn) {
  this.before.push(fn);
};

/**
 * Push `fn` into the after list.
 *
 * @param {Function} fn
 * @api public
 */

Batch.prototype.addAfter = function(fn) {
  this.after.push(fn);
};

/**
 * Register a function in either the "after before" list
 * or in the "before after" list, depending if a "main"
 * function exists.
 *
 * @see Batch#hasMain
 * @see Batch#main
 * @param {Function} fn
 * @api public
 */

Batch.prototype.add = function(fn) {
  (this.hasMain() ? this.beforeAfter : this.afterBefore).push(fn);
};

/**
 * Register a "main" function.
 *
 * @param {Function} fn
 * @api public
 */

Batch.prototype.main = function(fn) {
  this.fn = fn;
};

/**
 * Return if there is a main function or not.
 *
 * @returns {Boolean}
 * @api public
 */

Batch.prototype.hasMain = function() {
  return !!this.fn;
};

/**
 * Execute all registered functions. Keep in mind that the result of
 * the "main" function will be supplied to the last callback.
 *
 * @param {Function} last fn to execute
 * @api public
 */

Batch.prototype.run = function(fn) {
  var err = null;
  var main = this.fn;
  var batch = this.before.slice(0).concat(this.afterBefore);

  batch.push(function(next) {
    main(function(e) { err = e; next(); });
  });

  batch = batch.concat(this.beforeAfter).concat(this.after);

  batch.push(function() {
    fn(err);
  });

  function next() {
    var fn = batch.shift();
    if (!fn) return;
    if (fn.length) return fn(next);
    fn();
    next();
  }

  next();
};

/**
 * Primary exports.
 */

module.exports = Batch;
