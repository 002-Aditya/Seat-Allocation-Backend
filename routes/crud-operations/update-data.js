const express = require('express');
const router = express.Router();
const rowsArrangementController = require('../../controllers/rows-arrangement');
const logger = require('../../utils/logger');

const updateData = {
    rowsArrangement: rowsArrangementController.updateRows,
};

const handleUpdate = (req, res) => {
    const { type } = req.query;
    const controller = updateData[type];
    if (controller) {
        logger.info(`Controller for ${type} is found and called`);
        return controller(req, res);
    } else {
        logger.error("Invalid request");
        return res.status(404).send({ success: false, message: "Invalid request" });
    }
};

router.put('/', handleUpdate);

module.exports = router;