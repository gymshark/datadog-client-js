/**
 * Expose core logging-related classes and prototypes.
 * @type {function}
 */
exports.createLogger = require('./logger');

/**
 * Expose core metric relates classes and prototypes
 * @type {(function({}=): metrics.BufferedMetricsLogger)|{}}
 */
exports.createMetric = require('./metrics');