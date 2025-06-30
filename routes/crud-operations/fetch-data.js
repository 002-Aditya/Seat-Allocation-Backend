const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const rowsArrangementController = require('../../controllers/rows-arrangement');
const bookingsController = require('../../controllers/bookings');

// Controller to handle dynamic routing using a map
const getData = {
    rowsArrangement: rowsArrangementController.getAllRows,
    bookSeat: bookingsController.getAllBookings
};

const fetchData = (req, res) => {
    const { type } = req.query;
    const controller = getData[type];
    if (controller) {
        logger.info(`Controller for ${type} is found and called`);
        return controller(req, res);
    } else {
        logger.error("Invalid request");
        return res.status(404).send({ success: false, message: "Invalid request" });
    }
};

// Dynamic routes
router.get('/', fetchData);

module.exports = router;