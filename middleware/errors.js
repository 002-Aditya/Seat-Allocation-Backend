const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new DailyRotateFile({
            dirname: './logs',
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '5d', // Retain logs for the latest 5 days
            zippedArchive: true,
            maxSize: '20m', // Optional: Rotate logs if file size exceeds 20MB
        })
    ]
});

const error = (err, req, res, next) => {
    const status = err.statusCode || 500;
    let message = "An error occurred";
    if (err.statusCode === 401)
        message = `Authentication Failed`;
    if (err.statusCode === 429)
        message = `You have exceeded your maximum requests per minute limit.`;

    if (process.env.NODE_ENV === 'development') {
        message = err.message;
    }

    logger.error(`${status} - ${message} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    return res.status(status).json({ error: { message: message, statusCode: status } });

    // // If the request wants JSON, send a JSON response
    // if (req.accepts('json')) {
    //   return res.status(status).json(response);
    // }

    // // Otherwise, send a limited HTML response
    // res.status(status).send(`<pre>${message} (${status})</pre>`);
};

module.exports = error;


// const error = (err, req, res, next) => {
//   console.log(err);
//   const status = err.statusCode || 500;
//   const message = err.message || 'Error found';
//   res.status(status).json({ message: message});
// };

// module.exports = error