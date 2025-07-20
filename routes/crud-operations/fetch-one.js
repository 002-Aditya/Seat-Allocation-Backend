const express = require('express');
const router = express.Router();
const isAuth = require("../../middleware/auth");
const rowsArrangementController = require('../../controllers/rows-arrangement');
const handleMethodRouting = require("../handle-method-routings");
const bookingController = require("../../controllers/bookings");

const mappings = {
    rowsArrangement: rowsArrangementController.findRowsById,
    seatOfUser: bookingController.getBookingByUserId
};

router.get('/', isAuth, (req, res) => {
    handleMethodRouting(req, res, mappings);
});

module.exports = router;