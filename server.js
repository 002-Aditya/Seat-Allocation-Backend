require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const { db, initializeDb } = require('./utils/database/db-init');
const helmet = require('helmet');
const cors = require("./middleware/cors");
const swaggerUi = require('swagger-ui-express');
const logger = require('./utils/logger');
const routes = require('./routes/index-routes');
const { registerRoutes } = require("./routes/index-routes");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors);
app.use(helmet());

app.set('trust proxy', 1);

app.use(express.json());  // it is used to parse the body of POST requests

// Registering all the routes from within the single file
registerRoutes(app);

initializeDb()
    .then(() => {
        app.listen(port, () => {
            logger.info(`Server listening on port ${port}`);
        });
    })
    .catch((err) => {
        logger.error('DB init failed', err);
        process.exit(1);
    });

app.get('/', (req, res) => {
    logger.info("Service is running...");
    res.send('Hello, Seat Allocation Service this side!');
});
const server = app.listen(port);
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        logger.info(`Port ${port} is already in use`);
    } else {
        logger.error(error);
    }
});
server.on('listening', () => {
    console.log("This is added for git testing!!")
    logger.info(`Server listening on port ${port}`);
});