module.exports = process.env.NIXT_COV
  ? require('./lib-cov/nixt')
  : require('./lib/nixt');
