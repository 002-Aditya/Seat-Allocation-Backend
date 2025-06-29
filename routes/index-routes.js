const express = require('express');
const saveData = require('./crud-operations/save-data');
const fetchData = require('./crud-operations/fetch-data');
const getSingleRecord = require('./crud-operations/fetch-one');

const registerRoutes = (app) => {
    const apiRouter = express.Router();

    // Mount specific route modules under their respective paths
    apiRouter.use('/create-data', saveData);
    apiRouter.use('/retrieve-data', fetchData);
    apiRouter.use('/single-record', getSingleRecord);

    app.use('/seat-allocation', apiRouter);
};

module.exports = { registerRoutes };