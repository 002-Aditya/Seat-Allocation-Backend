const express = require('express');
const router = express.Router();
const isAuth = require('../../middleware/auth');
const rowsArrangementController = require('../../controllers/rows-arrangement');
const userController = require('../../controllers/user-details');
const handleMethodRouting = require("../handle-method-routings");

// Controller to handle dynamic routing using a map
const mappings = {
    user: userController.createUser,
    rowsArrangement: rowsArrangementController.createRows,
};

router.post('/', isAuth, (req, res) => {
    handleMethodRouting(req, res, mappings);
});

module.exports = router;