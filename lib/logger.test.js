const client = require('./client');
const TransportStream = require("winston-transport");
const assume = require("assume");
const isStream = require("is-stream");

describe('Create Logger', function () {
    it('should create a logger with default values', function () {
        let logger = client.createLogger({
            apiKey: '1234',
            service: 'test'
        });

        assume(logger).is.an('object');
        assume(isStream(logger.format));
        assume(logger.level).equals('info');
        assume(logger.exitOnError).equals(false);
        assume(logger.transports.length).equals(2);
        assume(logger.transports[1].options.host).equals('http-intake.logs.datadoghq.com');
    });
    it('should create a logger with additional transports', function () {
        const neverLogTo = new TransportStream({
            log: function (info) {
                assume(false).true('TransportStream was improperly written to');
            }
        });
        let logger = client.createLogger({
            apiKey: '1234',
            service: 'test',
            transports: [neverLogTo]

        });

        assume(logger).is.an('object');
        assume(isStream(logger.format));
        assume(logger.level).equals('info');
        assume(logger.exitOnError).equals(false);
        assume(logger.transports.length).equals(3);

    });
    it('should create a logger with overrides for eu dd region', function () {
        let logger = client.createLogger({
            apiKey: '1234',
            service: 'test',
            level: 'debug',
            ddRegion: 'eu',
        });

        assume(logger).is.an('object');
        assume(isStream(logger.format));
        assume(logger.level).equals('debug');
        assume(logger.exitOnError).equals(false);
        assume(logger.transports[1].options.host).equals('http-intake.logs.datadoghq.eu');
    });
    it('should create a logger with overrides for us3 dd region', function () {
        let logger = client.createLogger({
            apiKey: '1234',
            service: 'test',
            level: 'debug',
            ddRegion: 'us3',
        });

        assume(logger).is.an('object');
        assume(isStream(logger.format));
        assume(logger.level).equals('debug');
        assume(logger.exitOnError).equals(false);
        assume(logger.transports[1].options.host).equals('http-intake.logs.us3.datadoghq.com');
    });
    it('should create a logger with overrides for us5 dd region', function () {
        let logger = client.createLogger({
            apiKey: '1234',
            service: 'test',
            level: 'debug',
            ddRegion: 'us5',
        });

        assume(logger).is.an('object');
        assume(isStream(logger.format));
        assume(logger.level).equals('debug');
        assume(logger.exitOnError).equals(false);
        assume(logger.transports[1].options.host).equals('http-intake.logs.us5.datadoghq.com');
    });
    it('createLogger throws error when service is not set', function () {
        try {
            client.createLogger({
                apiKey: '1234',
            });
        } catch (e) {
            assume(e.message).equals('Missing required option: `service`');
        }
    });
    it('createLogger throws error when apiKey is not set', function () {
        try {
            client.createLogger({
                service: 'test',
            });
        } catch (e) {
            assume(e.message).equals('Missing required option: `apiKey`');
        }
    });

});