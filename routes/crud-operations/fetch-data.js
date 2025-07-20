const express = require('express');
const router = express.Router();
const isAuth = require("../../middleware/auth");
const rowsArrangementController = require('../../controllers/rows-arrangement');
const bookingController = require('../../controllers/bookings');
const handleMethodRouting = require("../handle-method-routings");

// Controller to handle dynamic routing using a map
const mappings = {
    rowsArrangement: rowsArrangementController.getAllRows,
    fetchAllActiveBookedSeats: bookingController.getAllBookings,
    bookSeatByRowId: bookingController.getAllBookingsByRowId
};

router.get('/', isAuth, (req, res) => {
    handleMethodRouting(req, res, mappings);
});

module.exports = router;