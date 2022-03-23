const winston = require("winston")
const { createConsoleTransport, createFileTransport, createElasticTransport, createSyslogTransport } = require('../transports')
const { logsJsonFormat, logsConsoleFormat, logsFileFormat } = require('../formats')
const makeSetLogLevel = require('./set-log-level')
const makeCreateLogger = require('./create-logger')
const makeDebugging = require('./debugging')

const mainLogger = winston.createLogger({ level: process.env.LOGGING_LOG_LEVEL })
const setLogLevel = makeSetLogLevel({ mainLogger })
const Logger = makeCreateLogger({ mainLogger })
const { startDebugging, stopDebugging, debugFor, debugSessionActive } = makeDebugging({ mainLogger, setLogLevel })

mainLogger.on('error', (error) => {
    console.error('Error caught', JSON.stringify(error));
});

const consoleTransport = createConsoleTransport({ format: logsConsoleFormat });
mainLogger.add(consoleTransport)

if (process.env.LOGGING_ELASTICSEARCH_ENABLED == 'true') {
    const elasticTransport = createElasticTransport({ format: logsJsonFormat })
    mainLogger.add(elasticTransport);
}

if (process.env.LOGGING_FILES_ENABLED == 'true') {
    const logFileTransport = createFileTransport({ format: logsFileFormat, filename: 'log' });
    mainLogger.add(logFileTransport);
}

if (process.env.LOGGING_SYSLOG_ENABLED == 'true') {
    const syslogTransport = createSyslogTransport({ format: logsJsonFormat })
    mainLogger.add(syslogTransport);
}

module.exports = {
    Logger,
    setLogLevel,
    startDebugging,
    stopDebugging,
    debugFor,
    debugSessionActive
}