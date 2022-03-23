const winston = require('winston')

module.exports = function ({ format }) {
    try {
        return new winston.transports.Console({ format })
    } catch (error) {
        console.error(error);
        throw new Error("Error occurred while creating console target")
    }
}