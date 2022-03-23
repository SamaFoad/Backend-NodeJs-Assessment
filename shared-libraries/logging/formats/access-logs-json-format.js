const { format } = require("winston");
const { combine, json } = format
const baseFormat = require('./access-logs-base')
const timestampFormat = require('./timestamp-format')

module.exports = combine(baseFormat(), timestampFormat(), json())