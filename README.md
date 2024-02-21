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


```javascript

```


#### Logger Options

### Metric Client
The metric client instantiation either returns [datadog-metrics](https://www.npmjs.com/package/datadog-metrics) metric client or if sampling is enabled, it will return a no-op client that will not send metrics to DataDog.

```javascript

```

#### Metric Options