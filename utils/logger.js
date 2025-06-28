const path = require('path');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { format } = require('winston');

const logDir = path.join(__dirname, '../logs');

// Custom filter to exclude 'error' level logs
const excludeErrors = format((info) => {
    return info.level === 'error' ? false : info;
});

const normalLogTransport = new DailyRotateFile({
    dirname: logDir,
    filename: 'application-info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    //   maxFiles: '5d',
    zippedArchive: false,
    // maxSize: '10m',
    format: format.combine(
        excludeErrors(),
        format.timestamp(),
        format.json()
    ),
});

const errorLogTransport = new DailyRotateFile({
    dirname: logDir,
    filename: 'application-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    // maxSize: '10m',
    // maxFiles: '5d',
    level: 'error',
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        normalLogTransport,
        errorLogTransport,
    ],
});

logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
}));

module.exports = logger;