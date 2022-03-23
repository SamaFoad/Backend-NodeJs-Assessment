const { format } = require("winston");
const { combine, printf } = format
const { format: fechaFormat } = require('fecha')
const baseFormat = require('./logs-base')
const timestampFormat = require('./timestamp-format')
const upcaseLevelFormat = require('./upcase-level-format')
const errorsFormat = require('./errors-format')

function formatPrintf() {
    return printf((info) => {
        function timestamp() {
            if (info.timestamp)
                return `Timestamp: ${fechaFormat(info.timestamp, 'MMM DD HH:mm:ss(ZZ)')}`
        }

        function loggerName() {
            if (info.loggerName)
                return `Name: ${info.loggerName}`
        }

        function level() {
            if (info.level)
                return `Level: ${info.level}`
        }

        function message() {
            if (info.message)
                return `Message: ${info.message}`
        }

        function metadata() {
            if (info.meta)
                return `Metadata: ${JSON.stringify(info.meta)}`
        }

        function stack() {
            if (info.stack)
                return `Stack: ${info.stack}`
        }

        function correlationId() {
            if (info.correlationId)
                return `Correlation Id: ${info.correlationId}`
        }

        return [level(), timestamp(), loggerName(), correlationId(), message(), metadata(), stack()].filter(Boolean).join(' | ');
    })
}

module.exports = combine(baseFormat(), timestampFormat(), errorsFormat(), upcaseLevelFormat(), formatPrintf())