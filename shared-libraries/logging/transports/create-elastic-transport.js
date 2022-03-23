const toLowerSnakeCase = require('../utils/to-lower-snake-case')
const { ElasticsearchTransport } = require('winston-elasticsearch');
const fecha = require('fecha')

module.exports = function ({
    format,
    indexPrefix = toLowerSnakeCase(process.env.LOGGING_APP_NAME),
    indexInterfix = '',
    indexSuffix = 'YYYY.MM.DD',
    host = process.env.LOGGING_ELASTICSEARCH_HOST,
    port = process.env.LOGGING_ELASTICSEARCH_PORT } = {}) {
    try {
        const protocol = ['localhost', '127.0.0.1'].includes(host) ? 'http' : 'https'

        const index = `${indexPrefix}${indexInterfix}-${fecha.format(new Date(), indexSuffix)}`
        const transport = new ElasticsearchTransport({ format, index, clientOpts: { node: `${protocol}://${host}:${port}` } });

        transport.on('warning', (error) => {
            console.error('Error caught', JSON.stringify(error));
        });

        return transport
    } catch (error) {
        console.error(error);
        throw new Error("Error occurred while creating elasticsearch target")
    }
}