const BookingsService = require("../services/allotment/bookings");
const logger = require("../utils/logger");
const { json } = require("express");

async function createNewBooking(req, res) {
    try {
        const bookSeat = req.body;
        if (!bookSeat || bookSeat.length === 0) {
            return res.status(400).send({ success: false, message: "Body is empty" });
        }
        const bookedSeat = await BookingsService.createBooking(req.body);
        if (!bookedSeat.success) {
            return res.status(500).send(json(bookedSeat.message));
        }
        return res.status(201).send(bookedSeat.message);
    } catch (e) {
        logger.error("Error occurred while booking a seat : " ,e);
        return res.status(400).json({ success: false, message: e.message });
    }
}

async function getAllBookings(req, res) {
    try {
        const rowId = req.query.rowId;
        if (!rowId) {
            return res.status(400).send({ success: false, message: "Row ID not found" });
        }
        const fetchBookings = await BookingsService.getBookingOnRowId(rowId);
        if (!fetchBookings.success) {
            return res.status(404).send({ success: false, message: fetchBookings.message });
        }
        return res.status(200).send(fetchBookings.message);
    } catch (e) {
        logger.error("Error occurred while getAllBookings : " ,e);
        return res.status(500).json({ success: false, message: e.message });
    }
}

module.exports = {
    createNewBooking,
    getAllBookings,
};