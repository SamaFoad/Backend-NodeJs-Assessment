const { createElasticTransport } = require('../../transports')
const { logsJsonFormat } = require('../../formats')
let debugSessionActive = false
let debugSessionElasticTransport;

module.exports = function makeDebugging({ mainLogger }) {
    function startDebugging() {
        if (debugSessionActive)
            return

        if (process.env.LOGGING_ELASTICSEARCH_ENABLED == 'true' && process.env.LOGGING_ELASTICSEARCH_CREATE_DEBUG_INDEX == 'true') {
            const indexInterfix = '_debug'
            const indexSuffix = 'YYYY.MM.DD.HH.mm.ssZZ';
            debugSessionElasticTransport = createElasticTransport({ format: logsJsonFormat, indexInterfix, indexSuffix })
            mainLogger.add(debugSessionElasticTransport)
        }

        mainLogger.level = "debug"
        debugSessionActive = true
    }

    function stopDebugging() {
        if (!debugSessionActive)
            return

        if (process.env.LOGGING_ELASTICSEARCH_ENABLED == 'true' && process.env.LOGGING_ELASTICSEARCH_CREATE_DEBUG_INDEX == 'true' && debugSessionElasticTransport) {
            mainLogger.remove(debugSessionElasticTransport)
        }

        mainLogger.level = "info"
        debugSessionActive = false
    }

    function debugFor(seconds = 30) {
        startDebugging()
        setTimeout(() => stopDebugging(), seconds * 1000)
    }

    return {
        startDebugging,
        stopDebugging,
        debugFor,
        debugSessionActive: () => debugSessionActive
    }
}