/**
 * Expose core logging-related classes and prototypes.
 * @type {function}
 */
exports.logger = require('./logger');

/**
 * Expose core metric relates classes and prototypes
 * @type {(function({}=): metrics.BufferedMetricsLogger)|{}}
 */
exports.metrics = require('./metrics');