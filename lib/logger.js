'use strict'

const {createLogger, format, transports} = require('winston');

function getDatadogDomain(region) {
    if (region === 'eu') {
        return 'http-intake.logs.datadoghq.eu';
    } else if (region === 'us3') {
        return 'http-intake.logs.us3.datadoghq.com';
    } else if (region === 'us5') {
        return 'http-intake.logs.us5.datadoghq.com';

    }
    return 'http-intake.logs.datadoghq.com';
}

function dataDogTransportOptions(apiKey, tags, region, source, service) {
    const ddtags = encodeURI(tags);
    if (!source) {
        source = 'javascript';
    }
    return {
        host: getDatadogDomain(region),
        path: `/api/v2/logs?dd-api-key=${apiKey}&ddsource=${source}&service=${service}&ddtags=${ddtags}`,
        ssl: true,
    };
}

module.exports = function (opts = {}) {
    if (!opts.apiKey) {
        throw new Error('Missing required option: `apiKey`')
    }
    if (!opts.service) {
        throw new Error('Missing required option: `service`')
    }

    return createLogger({
        level: 'info',
        exitOnError: false,
        format: format.json(),
        transports: [
            new transports.Console(),
            new transports.Http(dataDogTransportOptions(opts.apiKey, opts.tags, opts.ddRegion, opts.source, opts.service)),
        ],
        ...opts,
    });
}
