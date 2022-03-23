const { format } = require("winston");
const removeEmptyKeys = require('../utils/remove-empty-keys')
const removeKeys = require('../utils/remove-keys')
let rTracer = undefined

if (process.env.LOGGING_CORRELATION_ID_ENABLED == 'true')
    rTracer = require('cls-rtracer')

const keysToOmit = process.env.LOGGING_FILTER_KEYWORDS.split(',')

module.exports = format((info, opts) => {
    info.correlationId = rTracer ? rTracer.id() : undefined
    info.req.id = info.correlationId;
    info.method = info.req && info.req.method;
    info.path = info.req && info.req.path;
    info.remoteAddress = info.req && info.req.remoteAddress;
    info.requestStartTime = info.req && info.req.startTime;
    info.requestBody = info.req && info.req.body;
    info.requestParams = info.req && info.req.params;
    info.requestQuery = info.req && info.req.query;
    info.requestHeaders = info.req && info.req.headers;
    info.resStatus = info.res && info.res.statusCode;
    info.responseTime = info.responseTime;
    info.resContentLength = info.res && info.res.contentLength;
    info.responseStartTime = info.res && info.res.startTime;

    return removeKeys(removeEmptyKeys(info), keysToOmit, 'FILTERED');
})