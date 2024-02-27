const client = require('./client.js');
const assume = require("assume");

describe('Create Metrics', () => {
    test('should create metric client with default options', () => {
        let metrics = client.metrics({
            apiKey: 'api-key',
            prefix: 'test'
        });
        assume(metrics).is.an('object');
        assume(metrics.prefix).equals('test.');
        assume(metrics.reporter.site).equals('datadoghq.com');
    });
    test('createMetric throws error if apiKey not passed', () => {
        try{
            client.metrics({
                apiKey: '',
                prefix: 'test'
            });
        } catch (e) {
            assume(e.message).equals('Missing required option: `apiKey`');
        }
    });
    test('createMetric throws error if samplingEnabled and samplingKey not passed', () => {
        try{
            client.metrics({
                apiKey: 'tsst',
                prefix: 'test',
                samplingEnabled: true
            });
        } catch (e) {
            assume(e.message).equals('Missing required option: `samplingKey`');
        }
    });
    test('createMetric throws error if prefix not passed', () => {
        try{
            client.metrics({
                apiKey: 'test',
                prefix: ''
            });
        } catch (e) {
            assume(e.message).equals('Missing required option: `prefix`');
        }
    });
    test('should create metric client with eu dd region ', () => {
        let metrics = client.metrics({
            apiKey: 'api-key',
            prefix: 'testing.',
            ddRegion: 'eu'
        });
        assume(metrics).is.an('object');
        assume(metrics.prefix).equals('testing.');
        assume(metrics.reporter.site).equals('datadoghq.eu');
    });
    test('should create metric client with us3 dd region ', () => {
        let metrics = client.metrics({
            apiKey: 'api-key',
            prefix: 'testing.',
            ddRegion: 'us3'
        });
        assume(metrics).is.an('object');
        assume(metrics.prefix).equals('testing.');
        assume(metrics.reporter.site).equals('us3.datadoghq.com');
    });
    test('should create metric client with us5 dd region ', () => {
        let metrics = client.metrics({
            apiKey: 'api-key',
            prefix: 'testing.',
            ddRegion: 'us5'
        });
        assume(metrics).is.an('object');
        assume(metrics.prefix).equals('testing.');
        assume(metrics.reporter.site).equals('us5.datadoghq.com');
    });
    test('should create metric client with ap1 dd region ', () => {
        let metrics = client.metrics({
            apiKey: 'api-key',
            prefix: 'testing.',
            ddRegion: 'ap1'
        });
        assume(metrics).is.an('object');
        assume(metrics.prefix).equals('testing.');
        assume(metrics.reporter.site).equals('ap1.datadoghq.com');
    });
    test('should create metric client with sampling enabled and null reporter', () => {
        const samplingKey = 'ed6fa6ad-b3cd-44f1-b105-2a017ad0d463'
        let metrics = client.metrics({
            apiKey: 'api-key',
            prefix: 'test',
            samplingEnabled: true,
            samplingKey: samplingKey,
            samplingRate: 2

        });
        assume(metrics).is.an('object');
        assume(metrics.prefix).equals('test.');
        assume(metrics.reporter.constructor.name).equals('NullReporter');

        metrics.increment('test', 1)
    });
    test('should create metric client with sampling enabled and DD reporter', () => {
        const samplingKey = 'ed6fa6ad-b3cd-44f1-b105-2a017ad0d463'
        let metrics = client.metrics({
            apiKey: 'api-key',
            prefix: 'test',
            ddRegion: 'eu',
            samplingEnabled: true,
            samplingKey: `${samplingKey}-another${samplingKey}`,
            samplingRate: 50

        });
        assume(metrics).is.an('object');
        assume(metrics.prefix).equals('test.');
        assume(metrics.reporter.site).equals('datadoghq.eu');
    });
    test('should create metric client with sampling enabled, 0 sample rate', () => {
        let metrics = client.metrics({
            apiKey: 'api-key',
            prefix: 'test',
            samplingEnabled: true,
            samplingKey: 'b6715660-2c65-4ecb-84f3-e7063526535a', // This string produces a zero sample comparison value
            samplingRate: 0

        });
        assume(metrics).is.an('object');
        assume(metrics.prefix).equals('test.');
        assume(metrics.reporter.constructor.name).equals('NullReporter');
    });
});