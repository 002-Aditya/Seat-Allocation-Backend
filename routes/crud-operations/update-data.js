const express = require('express');
const router = express.Router();
const isAuth = require('../../middleware/auth');
const handleMethodRouting = require("../handle-method-routings");
const rowsArrangementController = require('../../controllers/rows-arrangement');
const userController = require('../../controllers/user-details');

const mappings = {
    rowsArrangement: rowsArrangementController.updateRows,
    user: userController.updateUserDetails,
};

router.put('/', isAuth, (req, res) => {
    handleMethodRouting(req, res, mappings);
});

module.exports = router;