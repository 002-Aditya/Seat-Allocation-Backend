const express = require('express');
const router = express.Router();
const rowsArrangementController = require('../controllers/rows-arrangement');
const logger = require('../utils/logger');

// Controller to handle dynamic routing using a map
const getData = {
    rowsArrangement: rowsArrangementController.getAllRows,
};

const fetchData = (req, res) => {
    const { type } = req.query;
    const controller = getData[type];
    if (controller) {
        logger.info(`Controller for ${type} is found and called`);
        return controller(req, res);
    } else {
        logger.error("Invalid request");
        res.status(404).send({ success: false, message: "Invalid request" });
    }
};

// Dynamic routes
router.get('/', fetchData);

module.exports = router;