const winston = require("winston")
const { createConsoleTransport, createFileTransport, createElasticTransport } = require('../transports')
const { accessLogsConsoleFormat, accessLogsFileFormat, accessLogsJsonFormat } = require('../formats')
const { v4 } = require('uuidv4');

const requestLogger = winston.createLogger({ level: 'info', defaultMeta: { loggerName: 'Access Logger' } })

requestLogger.on('error', (error) => {
    console.error('Error caught', error);
});

const consoleTransport = createConsoleTransport({ format: accessLogsConsoleFormat });
requestLogger.add(consoleTransport)

if (process.env.LOGGING_ELASTICSEARCH_ENABLED == 'true') {
    const indexInterfix = '_access'
    const elasticTransport = createElasticTransport({ format: accessLogsJsonFormat, indexInterfix })
    requestLogger.add(elasticTransport);
}

if (process.env.LOGGING_FILES_ENABLED == 'true') {
    const logFileTransport = createFileTransport({ format: accessLogsFileFormat, filename: 'access_log' });
    requestLogger.add(logFileTransport);
}

const middlewares = []

if (process.env.LOGGING_CORRELATION_ID_ENABLED == 'true') {
    const rTracer = require('cls-rtracer')
    middlewares.push(rTracer.expressMiddleware({ useHeader: true, requestIdFactory: v4, echoHeader: true }))
}

const requestLoggingMiddleware = function (req, res, next) {
    const logData = {
        req: {
            path: req.path,
            headers: req.headers,
            method: req.method,
            query: req.query || {},
            params: req.params || {},
            remoteAddress: req.ip || (req.connection && req.connection.remoteAddress) || undefined,
            body: req.body || {},
            startTime: new Date()
        }
    }

    const end = res.end;
    res.end = function (chunk, encoding) {
        logData.res = {
            contentLength: res.getHeader("content-length"),
            statusCode: res.statusCode,
            startTime: new Date(),
        }

        logData.responseTime = logData.res.startTime - logData.req.startTime

        res.end = end;
        res.end(chunk, encoding);

        requestLogger.info('', logData)
    };

    next();
};

middlewares.push(requestLoggingMiddleware)

module.exports = middlewares
