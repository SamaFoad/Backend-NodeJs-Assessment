module.exports = function makeSetLogLevel({ mainLogger }) {
    return function setLogLevel(level = "info") {
        if (!["error", "warn", "info", "http", "verbose", "debug", "silly"].includes(level))
            throw new Error(`Unknown log level: ${level}`)

        mainLogger.level = level;
    }
}