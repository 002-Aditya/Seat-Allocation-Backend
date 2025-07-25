const express = require('express');
const isAuth = require("../middleware/auth");
const saveData = require('./crud-operations/save-data');
const fetchData = require('./crud-operations/fetch-data');
const getSingleRecord = require('./crud-operations/fetch-one');
const updateRecord = require('./crud-operations/update-data');
const { login } = require('../controllers/authentication');
const { getDropDown } = require("../controllers/lov");
const { generateOtp, verifyOtp } = require("../controllers/otp");

const registerRoutes = (app) => {
    const apiRouter = express.Router();

    // Mount specific route modules under their respective paths
    apiRouter.use('/create-data', saveData);
    apiRouter.use('/retrieve-data', fetchData);
    apiRouter.use('/single-record', getSingleRecord);
    apiRouter.use('/update-data', updateRecord);
    apiRouter.post('/login', login);
    apiRouter.post('/lov', isAuth, getDropDown);
    apiRouter.post("/public/login/otp", generateOtp);
    apiRouter.post("/public/login/verify-otp", verifyOtp);

    app.use('/seat-allocation', apiRouter);
};

module.exports = { registerRoutes };