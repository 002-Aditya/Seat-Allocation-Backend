const express = require('express');
const router = express.Router();
const isAuth = require('../../middleware/auth');
const rowsArrangementController = require('../../controllers/rows-arrangement');
const userController = require('../../controllers/user-details');
const handleMethodRouting = require('../handle-method-routings');

const unauthenticatedMappings = {
    user: userController.createUser,
};

const authenticatedMappings = {
    rowsArrangement: rowsArrangementController.createRows,
};

router.post('/public', (req, res) => {
    handleMethodRouting(req, res, unauthenticatedMappings);
});

router.post('/', isAuth, (req, res) => {
    handleMethodRouting(req, res, authenticatedMappings);
});

module.exports = router;