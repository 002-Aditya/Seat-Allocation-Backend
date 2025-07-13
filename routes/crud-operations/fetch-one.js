const express = require('express');
const router = express.Router();
const rowsArrangementController = require('../../controllers/rows-arrangement');
const handleMethodRouting = require("../handle-method-routings");

const mappings = {
    rowsArrangement: rowsArrangementController.findRowsById,
};

router.get('/', (req, res) => {
    handleMethodRouting(req, res, mappings);
});

module.exports = router;