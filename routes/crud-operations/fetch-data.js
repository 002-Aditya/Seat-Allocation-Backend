const express = require('express');
const router = express.Router();
const rowsArrangementController = require('../../controllers/rows-arrangement');
const handleMethodRouting = require("../handle-method-routings");

// Controller to handle dynamic routing using a map
const mappings = {
    rowsArrangement: rowsArrangementController.getAllRows,
};

router.get('/', (req, res) => {
    handleMethodRouting(req, res, mappings);
});

module.exports = router;