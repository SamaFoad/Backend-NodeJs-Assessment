const { format } = require("winston");

module.exports = format((info, opts) => {
    info.timestamp = new Date()
    return info
})