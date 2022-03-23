const createConsoleTransport = require('./create-console-transport')
const createElasticTransport = require('./create-elastic-transport')
const createFileTransport = require('./create-file-transport')
const createSyslogTransport = require('./create-syslog-transport')

module.exports = {
    createConsoleTransport,
    createElasticTransport,
    createFileTransport,
    createSyslogTransport
}