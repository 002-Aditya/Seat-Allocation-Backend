require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const { sequelize } = require("./utils/database");
const helmet = require('helmet');
const cors = require("./middleware/cors");
const error = require("./middleware/errors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swaggerDef');
const logger = require('./utils/logger');

app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors);
app.use(helmet());

app.set('trust proxy', 1);

app.use(express.json());  // it is used to parse the body of POST requests

app.get('/', (req, res) => {
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
    logger.info(`Server listening on port ${port}`);
});