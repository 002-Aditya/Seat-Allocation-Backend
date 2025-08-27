require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const helmet = require('helmet');
const cors = require("./middleware/cors");
const logger = require('./utils/logger');
const { db, initializeDb } = require('./utils/database/db-init');
const { registerRoutes } = require("./routes/index-routes");
const setupGoogleAuth = require('./auth/google');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors);
app.use(helmet());
app.use(session({
    secret: `secret`,
    resave: false,
    saveUninitialized: true,
}));

app.set('trust proxy', 1);
app.use(express.json());    // parses JSON body of requests

// Register Google OAuth middleware and routes
setupGoogleAuth(app);
registerRoutes(app);

app.get('/', (req, res) => {
    logger.info("Service is running...");
    res.send('Hello, Seat Allocation Service this side!');
});

initializeDb()
    .then(() => {
        const server = app.listen(port, () => {
            logger.info(`Server listening on port ${port}`);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger.info(`Port ${port} is already in use`);
            } else {
                logger.error(error);
            }
        });

        server.on('listening', () => {
            logger.info(`Server listening on port ${port}`);
        });
    })
    .catch((err) => {
        logger.error('DB init failed', err);
        process.exit(1);
    });