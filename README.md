# DataDog Client JS

This is an opinionated client for integrating with DataDog directly for logging and metrics. 
This package is designed to be a wrapper for simplifying the instantiation of existing package implementations.

[![Build and Test](https://github.com/gymshark/datadog-client-js/actions/workflows/build.yaml/badge.svg)](https://github.com/gymshark/datadog-client-js/actions/workflows/build.yaml)
[![Publish Package](https://github.com/gymshark/datadog-client-js/actions/workflows/publish.yaml/badge.svg?branch=main)](https://github.com/gymshark/datadog-client-js/actions/workflows/publish.yaml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/51830d3cc410417c94543df82dc09a6f)](https://app.codacy.com/gh/gymshark/datadog-client-js/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/51830d3cc410417c94543df82dc09a6f)](https://app.codacy.com/gh/gymshark/datadog-client-js/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

## Requirements

* Node 18.x or higher
* Datadog API and App Key

## Installation

```bash
npm install @gymshark/datadog-client
```
or
```bash
yarn add @gymshark/datadog-client
```

## Usage

### Logger Client
The logging client returns [winston](https://www.npmjs.com/package/winston) logging client that includes a HTTP transport for sending logs to DataDog.
Some of the winston logger options are preset to ensure that logs are sent to DataDog in a JSON format, but any of the winston configuration can be overridden.

The logger is configured to have 2 transports:
1. Console Transport to log to the console
2. HTTP Transport to configured to send logs to DataDog

<details open>
<summary>With Mandatory Options</summary>

Using `require` to import dependencies
```javascript
const client = require('@gymsark/datadog-client');

const logger = client.logger({
    apiKey: 'dd-api-key',
    service: 'test'
});

logger.info('Hello World');
```

Using `import` to import dependencies
```javascript
import  client from '@gymsark/datadog-client';

const logger = client.logger({
    apiKey: 'dd-api-key',
    service: 'test'
});

logger.info('Hello World');
```
</details>

<details>
<summary>With DataDog Region</summary>

Using `require` to import dependencies
```javascript
const client = require('@gymsark/datadog-client');

const logger = client.logger({
    apiKey: 'dd-api-key',
    service: 'test',
    ddRegion: 'eu'
});

logger.info('Hello World');
```

Using `import` to import dependencies
```javascript
import  client from '@gymsark/datadog-client';

const logger = client.logger({
    apiKey: 'dd-api-key',
    service: 'test',
    ddRegion: 'eu'
});

logger.info('Hello World');
```
</details>
<details>
<summary>With All Options</summary>

Using `require` to import dependencies
```javascript
const client = require('@gymsark/datadog-client');
const winston = require('winston');

const logger = client.logger({
    apiKey: 'dd-api-key',
    service: 'test',
    ddRegion: 'eu',
    tags: 'env:develop,app:this-service,version:1.0.0',
    level: `debug`,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
  additionalTransports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});

logger.info('Hello World');
```

Using `import` to import dependencies
```javascript
import  client from '@gymsark/datadog-client';
import winston from 'winston';

const logger = client.logger({
    apiKey: 'dd-api-key',
    service: 'test',
    ddRegion: 'eu',
    tags: 'env:develop,app:this-service,version:1.0.0',
    level: `debug`,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
  additionalTransports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});
logger.info('Hello World');
```
</details>

#### Logger Options
- **apiKey** - Your DataDog API Key *[required]*
- **service** - The name of the application or service generating the logs *[required]*
- **ddRegion** - The region yourDataDog account is in. This is used to determine the DataDog domain.
- **tags** - A comma separated string of tags to be included with each log entry when sending to Datadog
- **source** - The source of the logs, typically the technology the log originated. [See reserved attributes](https://docs.datadoghq.com/logs/log_configuration/attributes_naming_convention/#reserved-attributes). Defaults to `nodejs`
- **additionalTransports** - Any additional [winston](https://www.npmjs.com/package/winston) transports to be added to the logger. Setting `transports` in the options will result in the default transports been overridden.
- Any [winston](https://www.npmjs.com/package/winston) logger options
  - Some are defaulted to the following:
    - **level** - `info`
    - **format** - `winston.format.json()`
    - **exitOnError** - `false`
    - **transports** - `Console Transport` and `HTTP Transport`

### Metric Client
The metric client instantiation either returns [datadog-metrics](https://www.npmjs.com/package/datadog-metrics) metric client with some additional logic for handling whether sampling of metrics.
The sampling logic will take a unique key and a sampling rate, the key will be hashed and the hash will be used to determine if the metric should be sent to DataDog.

<details open>
<summary>With Mandatory Options</summary>

Using `require` to import dependencies
```javascript
const client = require('@gymsark/datadog-client');

const metrics = client.metrics({
  apiKey: 'dd-api-key',
  prefix: 'test'
});

metrics.increment('api.call', 1, ['env:develop']);
```

Using `import` to import dependencies
```javascript
import client from '@gymsark/datadog-client';

const metrics = client.metrics({
    apiKey: 'dd-api-key',
    prefix: 'test'
});

metrics.increment('api.call', 1, ['env:develop']);
```
</details>

#### Metric Options
- **apiKey** - Your DataDog API Key *[required]*
- **prefix** - The prefix to be added to all metrics *[required]*
- **ddRegion** - The region yourDataDog account is in. This is used to determine the DataDog domain.
- **samplingEnabled** - A boolean to determine if sampling should be enabled. Defaults to `false`
- **samplingKey** - A unique string to be used to determine if the metric should be sampled. *[required if samplingEnabled is true]*
  - The **samplingKey** is required in cases where you need to instantiate the metric client multiple times in different sandboxes,
    and you want to ensure that the same sampling setup is provided for each sandbox.
  - And example use case of this is Auth0 actions, where you may have multiple actions running in the same environment,
    and you want to ensure that the same sampling rate is applied to each action.
- **samplingRate** - The rate at which metrics should be sampled. This value is a percentage representation of the rate. Defaults to `0`
- Any [datadog-metrics](https://www.npmjs.com/package/datadog-metrics) logger options