'use strict';

const {BufferedMetricsLogger, reporters} = require('datadog-metrics');
const crypto = require('crypto');

function getDataDogDomain(region) {
    if (region === 'eu') {
        return 'datadoghq.eu';
    } else if (region === 'us3') {
        return 'us3.datadoghq.com';
    } else if (region === 'us5') {
        return 'us5.datadoghq.com';
    } else if (region === 'ap1') {
        return 'ap1.datadoghq.com';
    }
    return 'datadoghq.com';
}

function samplingMetricReporter(samplingKey, sampleRate) {
    let reporter;
    // Use the crypto library to create a hash object
    const hash_object = crypto.createHash('md5');

    // Update the hash object
    hash_object.update(samplingKey);

    // Get the hexadecimal digest of the hash and convert it to a BigInt
    const hash_hex = hash_object.digest('hex');
    const hash_integer = BigInt('0x' + hash_hex);

    // Map the hash value to a number between 0 and 100
    const sampleComparison = Number(hash_integer % BigInt(101)); // Modulo 101 ensures the result is between 0 and 100
    if ((sampleRate === 0 && sampleComparison === 0) || sampleRate < sampleComparison) {
        reporter = new reporters.NullReporter();
    }

    return reporter;
}

module.exports = function (opts = {}) {
    if (!opts.apiKey) {
        throw new Error('Missing required option: `apiKey`')
    }
    if (!opts.prefix) {
        throw new Error('Missing required option: `prefix`')
    }

    if (opts.samplingEnabled && !opts.samplingKey) {
        throw new Error('Missing required option: `samplingKey`')
    }

    let reporter;
    if (opts.samplingEnabled) {
        const sampleRate = parseInt(opts.samplingRate, 10) || 0;
        reporter = samplingMetricReporter(opts.samplingKey, sampleRate);
    }

    if (opts.prefix) {
        opts.prefix += opts.prefix.endsWith('.') ? '' : '.';
    }

    return new BufferedMetricsLogger({
        reporter,
        prefix: opts.prefix,
        site: getDataDogDomain(opts.ddRegion),
        apiKey: opts.apiKey,
        flushIntervalSeconds: 0, // need to manually flush to get metrics as the buffer isn't flushed on exit
        ...opts,
    });
}