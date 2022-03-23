const { format } = require("winston");
const { combine, printf } = format
const { format: fechaFormat } = require('fecha')
const baseFormat = require('./logs-base')
const timestampFormat = require('./timestamp-format')
const upcaseLevelFormat = require('./upcase-level-format')
const errorsFormat = require('./errors-format')
const colorizeFormat = require('./colorize-format')

function formatPrintf() {
    return printf((info) => {
        function timestamp() {
            if (info.timestamp)
                return fechaFormat(info.timestamp, 'MMM DD HH:mm:ss(ZZ)')
        }

        function loggerName() {
            if (info.loggerName)
                return info.loggerName
        }

        function level() {
            if (info.level)
                return info.level
        }

        function message() {
            if (info.message)
                return info.message
        }

        function metadata() {
            if (info.meta)
                return JSON.stringify(info.meta)
        }

        function stack() {
            if (info.stack)
                return info.stack
        }

        function correlationId() {
            if (info.correlationId)
                return info.correlationId
        }

        return [level(), timestamp(), loggerName(), message(), metadata(), stack(), correlationId()].filter(Boolean).join(' | ');
    })
}

module.exports = combine(baseFormat(), timestampFormat(), errorsFormat(), upcaseLevelFormat(), colorizeFormat(), formatPrintf())