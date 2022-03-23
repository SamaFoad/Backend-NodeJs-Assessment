const { format } = require("winston");
const { combine, json } = format
const baseFormat = require('./logs-base')
const timestampFormat = require('./timestamp-format')
const errorsFormat = require('./errors-format')

module.exports = combine(baseFormat(), timestampFormat(), errorsFormat(), json())