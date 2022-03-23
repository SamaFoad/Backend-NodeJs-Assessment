const { format } = require("winston");

module.exports = format((info) => {
    if (info.level)
        info.level = info.level.toUpperCase()
    return info
})