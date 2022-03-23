# Logging Utilities

- [Logging Utilities](#logging-utilities)
  - [Create logger](#create-logger)
  - [Log method](#log-method)
  - [Alias log methods](#alias-log-methods)
  - [Changing log level](#changing-log-level)
  - [Debugging](#debugging)
  - [Request logging middleware](#request-logging-middleware)
  - [Configuration](#configuration)

## Create logger

Inorder to create a logger instance just call `createLogger()` and you are set to go.

```js
const { createLogger } = require('logging')
const logger = createLogger()

logger.info('Hello World')
```

Note: The logger name is determined from the filename where the logger was created. \
Examples:

| Filename | Logger name |
|---|---|
| '/foo/baz.js' | Baz |
| '/foo/baz/index.js' | Baz |
| '/foo/my-great-file.js' | My Great File |

Note: The full filename is also available with every log entry.

`createLogger(defaultMeta)` optionally accepts a default meta object that will get logged with every log created by this instance.

## Log method

Each logger instance exposes a log method that can accept one of the following signatures.

```js
(level: string, message: string): Logger;
```

```js
(level: string, payloadOrError: object): Logger;
```

```js
(level: string, message: string, payloadOrError: object): Logger;
```

```js
(level: string, error: object, payload: object): Logger;
```

```js
(level: string, message: string, error: object, payload: object): Logger;
```

## Alias log methods

For each npm log level there is a convenient method that accepts the same signatures as the log method but without the first argument.

```js
logger.error()
logger.warn()
logger.info()
logger.http()
logger.verbose()
logger.debug()
logger.silly()
```

## Changing log level

To change log level call `setLogLevel()` with a valid npm log level.

```js
const { createLogger, setLogLevel } = require('logging')
const logger = createLogger()

logger.debug('Log message not displayed since log level is info')
setLogLevel('debug')
logger.debug('Log message is displayed')
```

## Debugging

To start debugging call `startDebugging()` . Now logs will show debug level logs and higher. Whenever you are done just call `stopDebugging()`. Now log level is reset to info.

If you want to debug for a certain period you can call `debugFor(30)`. Which will switch log level to debug for 30 seconds.

You can check to see if a debug session is active by calling `debugSessionActive()`.

By default we don't create a separate debugging index when logging to elasticsearch is enabled. You can enable this behavior by setting `LOGGING_ELASTICSEARCH_CREATE_DEBUG_INDEX` to true.

## Request logging middleware

An Express middleware for logging incoming requests.

```js
const express = require('express')
const app = express()
const { requestLoggingMiddleware } = require('logging')

app.use(requestLoggingMiddleware)
```

By default logging correlation ids is disabled, to enable it set `LOGGING_CORRELATION_ID_ENABLED` to true. This will prepend the request logging middleware with a middleware that extracts correlation id from incoming request. Internally it uses `AsyncLocalStorage API` to save the correlation id within the scope of the request. That way every log that is made during the request processing pipeline will have a correlation id that points to the related request.

## Configuration

The logging module is configurable through environment variables. Available options are.

| Variable | Default | Description |
|---|---|---|
| LOGGING_LOG_LEVEL | info | Default log level to use when app starts |
| LOGGING_APP_NAME | process.title() | Used for syslog and elasticsearch app name and indices |
| LOGGING_ELASTICSEARCH_ENABLED | false | Enable centralized logging |
| LOGGING_ELASTICSEARCH_HOST | localhost | Host running elasticsearch |
| LOGGING_ELASTICSEARCH_PORT | 9200 | Port on which elasticsearch is listening |
| LOGGING_ELASTICSEARCH_CREATE_DEBUG_INDEX | false | Controls whether to create a separate debug index for debugging sessions |
| LOGGING_FILES_ENABLED | false | Enables logging to files (access and logs) |
| LOGGING_FILES_DIR | '${process.cwd()}/logs' | Location to use to store log files relative to root of the app |
| LOGGING_SYSLOG_ENABLED | false | Enables logging to syslog |
| LOGGING_SYSLOG_FACILITY | user | Syslog facility |
| LOGGING_SYSLOG_PROTOCOL | local | Syslog protocol to use. Valid options are [local, tcp, udp] |
| LOGGING_SYSLOG_DGRAM_SOCKET | /dev/log | Datagram socket location used for local protocol |
| LOGGING_SYSLOG_HOST | localhost | Host running syslog used for tcp, udp protocols |
| LOGGING_SYSLOG_PORT | 2070 | Port on which syslog is listening |
| LOGGING_CORRELATION_ID_ENABLED | false | Controls whether to log correlation id with every log entry |
| LOGGING_FILTER_KEYWORDS |   | Comma separated list of keywords to filter from logs |
