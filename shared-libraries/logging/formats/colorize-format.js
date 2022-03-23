const { format, config } = require("winston");
const { colorize } = format

module.exports = function () {
    return colorize({
        colors: config.npm.colors, all: true
    })
}