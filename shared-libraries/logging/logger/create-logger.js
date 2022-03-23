const path = require('path')
const { getCallerFilename, capitalizeWithSpaceSeparator } = require('../utils')
const isObject = require('../utils/is-object')

module.exports = function makeCreateLogger({ mainLogger }) {
    return function Logger(name = undefined, defaultMeta = {}) {
        delete defaultMeta.loggerName

        if (!name) {
            const filename = getCallerFilename(new Error())
            name = generateLoggerName(filename)
            name = capitalizeWithSpaceSeparator(name)
        }

        let childLogger = mainLogger.child({ loggerName: name, ...defaultMeta });

        this.setName = function (name) {
            // Note: changing inner logger instance may seem like not the best option. However, 
            // what really happens when creating a child logger is winston modifies the info
            // object that gets logged with some extra properties. So this wouldn't impact 
            // performance. Also there is no other way to directly modify default metadata object.
            childLogger = mainLogger.child({ loggerName: name, ...defaultMeta })
        }

        this.error = function (...args) {
            this.log('error', ...args)
        }

        this.warn = function (...args) {
            this.log('warn', ...args)
        }

        this.info = function (...args) {
            this.log('info', ...args)
        }

        this.http = function (...args) {
            this.log('http', ...args)
        }

        this.verbose = function (...args) {
            this.log('verbose', ...args)
        }

        this.debug = function (...args) {
            this.log('debug', ...args)
        }

        this.silly = function (...args) {
            this.log('silly', ...args)
        }

        this.log = function (level, ...rest) {
            if (arguments.length == 2 && typeof arguments[1] == "string") {
                childLogger.log(level, rest[0])
            } else if (arguments.length == 2 && isObject(arguments[1]) && arguments[1] instanceof Error) {
                childLogger.log(level, rest[0])
            } else if (arguments.length == 2) {
                childLogger.log(level, '', { meta: rest[0] })
            } else if (arguments.length == 3 && typeof arguments[1] == "string" && isObject(arguments[2]) && arguments[2] instanceof Error) {
                childLogger.log({ level, message: rest[0], err: rest[1] })
            } else if (arguments.length == 3 && typeof arguments[1] == "string") {
                childLogger.log(level, rest[0], { meta: rest[1] })
            } else if (arguments.length == 3 && isObject(arguments[1]) && arguments[1] instanceof Error) {
                childLogger.log({ level, message: '', err: rest[0], meta: rest[1] })
            } else if (arguments.length == 4 && typeof arguments[1] == "string" && isObject(arguments[2]) && arguments[2] instanceof Error) {
                childLogger.log({ level, message: rest[0], err: rest[1], meta: rest[2] })
            }
        }
    }
}

function generateLoggerName(filename) {
    const parsed = path.parse(filename)

    if (parsed.name == "index" && filename)
        return generateLoggerName(filename.substring(0, filename.lastIndexOf('/')))

    return parsed.name
}