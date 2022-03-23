const { transports, format: winstonFormat } = require('winston')
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path')

module.exports = function createFileTransport({
    logDir = process.env.LOGGING_FILES_DIR,
    filter = (logEntry) => logEntry,
    format,
    filename
}) {
    try {
        if (!fs.existsSync(logDir))
            fs.mkdirSync(logDir);

        const filterFormat = winstonFormat((info, opts) => filter(info))
        return new transports.DailyRotateFile({
            filename: `${filename}-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            // maxSize: '20m',
            // maxFiles: '14d',
            dirname: logDir,
            format: winstonFormat.combine(filterFormat(), format)
        });
    } catch (error) {
        console.error(error);
        throw new Error("Error occurred while creating file target")
    }
}