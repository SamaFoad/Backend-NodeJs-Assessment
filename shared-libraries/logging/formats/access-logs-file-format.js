const { format } = require("winston");
const { combine, printf } = format
const { format: fechaFormat } = require('fecha')
const baseFormat = require('./access-logs-base')
const timestampFormat = require('./timestamp-format')
const upcaseLevelFormat = require('./upcase-level-format')

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

        function correlationId() {
            if (info.correlationId)
                return `Correlation Id: ${info.correlationId}`
        }

        function method() {
            if (info.method)
                return `Method: ${info.method}`
        }

        function path() {
            if (info.path)
                return `Path: ${info.path}`
        }

        function remoteAddress() {
            if (info.remoteAddress)
                return `Remote Address: ${info.remoteAddress}`
        }

        function requestStartTime() {
            if (info.requestStartTime)
                return `Request Start: ${fechaFormat(info.requestStartTime, 'HH:mm:ss:SS(ZZ)')}`
        }

        function requestBody() {
            if (info.requestBody)
                return `Request Body: ${JSON.stringify(info.requestBody)}`
        }

        function requestParams() {
            if (info.requestParams)
                return `Request Params: ${JSON.stringify(info.requestParams)}`
        }

        function requestQuery() {
            if (info.requestQuery)
                return `Request Query: ${JSON.stringify(info.requestQuery)}`
        }

        function requestHeaders() {
            if (info.requestHeaders)
                return `Request Headers: ${JSON.stringify(info.requestHeaders)}`
        }

        function status() {
            if (info.resStatus)
                return `Status: ${info.resStatus}`
        }

        function responseTime() {
            if (info.responseTime)
                return `Response Time: ${info.responseTime}ms`
        }

        function resContentLength() {
            if (info.resContentLength)
                return `Response Content Length: ${info.resContentLength}B`
        }

        function responseStartTime() {
            if (info.responseStartTime)
                return `Response Start: ${fechaFormat(info.responseStartTime, 'HH:mm:ss:SS(ZZ)')}`
        }

        return [level(), timestamp(), loggerName(), correlationId(), method(), path(), remoteAddress(), requestStartTime(), status(), responseTime(), resContentLength(), responseStartTime(), requestBody(), requestParams(), requestQuery(), requestHeaders()].filter(Boolean).join(' | ');
    })
}

module.exports = combine(baseFormat(), timestampFormat(), upcaseLevelFormat(), formatPrintf())