const express = require('express');
const saveData = require('./save-data');

const registerRoutes = (app) => {
    const apiRouter = express.Router();

    // Mount specific route modules under their respective paths
    apiRouter.use('/create-data', saveData);
    app.use('/seat-allocation', apiRouter);
};

module.exports = { registerRoutes };