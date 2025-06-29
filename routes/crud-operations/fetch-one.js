const express = require('express');
const router = express.Router();
const rowsArrangementController = require('../../controllers/rows-arrangement');
const logger = require('../../utils/logger');

const getOneResult = {
    rowsArrangement: rowsArrangementController.findRowsById,
};

const fetchOne = (req, res) => {
    const { type } = req.query;
    const controller = getOneResult[type];
    if (controller) {
        logger.info(`Controller for ${type} is found and called`);
        return controller(req, res);
    } else {
        logger.error("Invalid request");
    }
};

router.get('/', fetchOne);

module.exports = router;