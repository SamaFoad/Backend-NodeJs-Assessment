const winston = require("winston")
require('winston-syslog').Syslog;

module.exports = function createSyslogTransport({
    protocol = process.env.LOGGING_SYSLOG_PROTOCOL,
    facility = process.env.LOGGING_SYSLOG_FACILITY,
    dgram = process.env.LOGGING_SYSLOG_DGRAM_SOCKET,
    host = process.LOGGING_SYSLOG_HOST,
    port = process.LOGGING_SYSLOG_PORT,
    appName = process.env.LOGGING_APP_NAME,
    format
}) {
    try {
        const winstonSyslogOptions = {
            format: winston.format.combine(mapToSyslogLevels(), format),
            facility,
            appName
        }

        switch (protocol) {
            case "local":
                winstonSyslogOptions.protocol = "unix"
                winstonSyslogOptions.path = dgram
                break;
            case "tcp":
                winstonSyslogOptions.protocol = "tcp4"
                winstonSyslogOptions.host = host
                winstonSyslogOptions.port = port
                break;
            case "udp":
                winstonSyslogOptions.protocol = "udp4"
                winstonSyslogOptions.host = host
                winstonSyslogOptions.port = port
                break;
            default:
                throw Error('Unknown syslog protocol')
        }

        return new winston.transports.Syslog(winstonSyslogOptions);
    } catch (error) {
        console.error(error);
        throw new Error("Error occurred while creating syslog target")
    }
}

const mapToSyslogLevels = winston.format((info, opts) => {
    // emerg, alert, crit -> unused
    switch (info.level) {
        case "error":
            info.level = "error"
            info[Symbol.for('level')] = "error"
            break;
        case "warn":
            info.level = "warning"
            info[Symbol.for('level')] = "warning"
            break;
        case "info":
            info.level = "notice"
            info[Symbol.for('level')] = "notice"
            break;
        case "http":
        case "verbose":
        case "debug":
            info.level = "info"
            info[Symbol.for('level')] = "info"
            break;
        case "silly":
            info.level = "debug"
            info[Symbol.for('level')] = "debug"
            break;
    }
    return info;
});