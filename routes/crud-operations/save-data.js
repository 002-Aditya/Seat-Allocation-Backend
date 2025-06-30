const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const rowsArrangementController = require('../../controllers/rows-arrangement');
const bookSeatController = require('../../controllers/bookings');

// Controller to handle dynamic routing using a map
const saveData = {
    rowsArrangement: rowsArrangementController.createRows,
    bookSeat: bookSeatController.createNewBooking
};

const handleSave = (req, res) => {
    const { type } = req.query;
    const controller = saveData[type];
    if (controller) {
        logger.info(`Controller for ${type} is found and called`);
        return controller(req, res);
    } else {
        logger.error("Invalid request");
        res.status(404).send({ success: false, message: "Invalid request" });
    }
};

// Dynamic routes
router.post('/', handleSave);

module.exports = router;