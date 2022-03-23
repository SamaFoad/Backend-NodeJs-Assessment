const { format } = require("winston");
const { combine, printf } = format
const { format: fechaFormat } = require('fecha')
const baseFormat = require('./access-logs-base')
const timestampFormat = require('./timestamp-format')
const colorizeFormat = require('./colorize-format')
const upcaseLevelFormat = require('./upcase-level-format')

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

        function correlationId() {
            if (info.correlationId)
                return info.correlationId
        }

        function method() {
            if (info.method)
                return info.method
        }

        function path() {
            if (info.path)
                return info.path
        }

        function requestBody() {
            if (info.requestBody)
                return JSON.stringify(info.requestBody)
        }

        function requestParams() {
            if (info.requestParams)
                return JSON.stringify(info.requestParams)
        }

        function requestQuery() {
            if (info.requestQuery)
                return JSON.stringify(info.requestQuery)
        }

        function requestHeaders() {
            if (info.requestHeaders)
                return JSON.stringify(info.requestHeaders)
        }

        function status() {
            if (info.resStatus)
                return info.resStatus
        }

        function responseTime() {
            if (info.responseTime)
                return `${info.responseTime}ms`
        }

        function resContentLength() {
            if (info.resContentLength)
                return `${info.resContentLength}B`
        }

        return [level(), timestamp(), loggerName(), correlationId(), `${method()} ${path()}`, requestBody(), requestParams(), requestQuery(), requestHeaders(), `${status()} ${responseTime()}`, resContentLength()].filter(Boolean).join(' | ');
    })
}

module.exports = combine(baseFormat(), timestampFormat(), upcaseLevelFormat(), colorizeFormat(), formatPrintf())