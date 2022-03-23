const path = require('path')
const { cleanEnv, port, str, bool, host, makeValidator } = require('envalid');

const commaSeparatedString = makeValidator(x => {
    if (/^(.*)(,\s*.+)*$/.test(x)) return x
    else throw new Error('Expected comma separated string')
})
const cleanedEnv = cleanEnv(process.env, {
    LOGGING_LOG_LEVEL: str({ choices: ['error', 'warn', 'info', 'http', 'verbose', 'debug'], default: 'info' }),
    LOGGING_APP_NAME: str({ default: process.title }),
    LOGGING_ELASTICSEARCH_ENABLED: bool({ default: false }),
    LOGGING_ELASTICSEARCH_HOST: host({ default: 'localhost' }),
    LOGGING_ELASTICSEARCH_PORT: port({ default: 9200 }),
    LOGGING_ELASTICSEARCH_CREATE_DEBUG_INDEX: bool({ default: false }),
    LOGGING_FILES_ENABLED: bool({ default: false }),
    LOGGING_FILES_DIR: str({ default: path.resolve(process.cwd(), 'logs') }),
    LOGGING_SYSLOG_ENABLED: bool({ default: false }),
    LOGGING_SYSLOG_FACILITY: str({ default: 'user' }),
    LOGGING_SYSLOG_PROTOCOL: str({ choices: ['local', 'tcp', 'udp'], default: 'local' }),
    LOGGING_SYSLOG_DGRAM_SOCKET: str({ default: '/dev/log' }),
    LOGGING_SYSLOG_HOST: host({ default: 'localhost' }),
    LOGGING_SYSLOG_PORT: port({ default: 514 }),
    LOGGING_CORRELATION_ID_ENABLED: bool({ default: true }),
    LOGGING_FILTER_KEYWORDS: commaSeparatedString({ default: 'token,token-secret' })
});

process.env = Object.assign(process.env, cleanedEnv);

module.exports = {
    ...require('./logger'),
    requestLoggingMiddleware: require('./request-logging-middleware')
}