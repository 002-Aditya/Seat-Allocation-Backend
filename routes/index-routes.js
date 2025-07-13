const express = require('express');
const saveData = require('./crud-operations/save-data');
const fetchData = require('./crud-operations/fetch-data');
const getSingleRecord = require('./crud-operations/fetch-one');
const updateRecord = require('./crud-operations/update-data');
const { login } = require('../controllers/authentication');

const registerRoutes = (app) => {
    const apiRouter = express.Router();

    // Mount specific route modules under their respective paths
    apiRouter.use('/create-data', saveData);
    apiRouter.use('/retrieve-data', fetchData);
    apiRouter.use('/single-record', getSingleRecord);
    apiRouter.use('/update-data', updateRecord);
    apiRouter.post('/login', login);

    app.use('/seat-allocation', apiRouter);
};

module.exports = { registerRoutes };