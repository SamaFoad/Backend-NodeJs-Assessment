const { format } = require("winston");
const removeEmptyKeys = require('../utils/remove-empty-keys')
const removeKeys = require('../utils/remove-keys')
let rTracer = undefined

if (process.env.LOGGING_CORRELATION_ID_ENABLED == 'true')
    rTracer = require('cls-rtracer')

const keysToOmit = process.env.LOGGING_FILTER_KEYWORDS.split(',')

module.exports = format((info, opts) => {

    info.correlationId = rTracer ? rTracer.id() : undefined

    return removeKeys(removeEmptyKeys(info), keysToOmit, 'FILTERED')
})