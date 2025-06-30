const db = require("../../utils/db-init");
const logger = require("../../utils/logger");
const { filterData } = require('../../utils/filter-data');

const BookingService = {

    async getBookingModel() {
        try {
            const db = await require("../../utils/db-init");
            if (!db.allotment || !db.allotment.Bookings) {
                logger.error("No booking model found");
                return { success: false, message: "No booking model found" };
            }
            return db.allotment.Bookings;
        } catch (e) {
            logger.error("Booking model not found");
            return { success: false, message: e.message }
        }
    },

    async createBooking(booking) {
        const t = await db.sequelize.transaction();
        try {
            const Booking = await this.getBookingModel();

            // verify if some person is already sitting on the selected seat or not
            const fetchBookingDetails = await this.fetchBookingOnRowAndSeat(booking.rowId, booking.seatNo);
            if (!fetchBookingDetails.success) {
                await t.rollback();
                return { success: false, message: fetchBookingDetails.message };
            }

            const filterInput = await filterData([booking]);
            const createdInstance = await Booking.create(filterInput[0], { transaction: t });
            const plainData = createdInstance.get({ plain: true });
            const filteredOutput = await filterData([plainData]);
            logger.info(`Booking created for ${filteredOutput[0].bookedBy} with the booking ID ${filteredOutput[0].bookingId}`);
            await t.commit();
            return { success: true, message: filteredOutput[0] };
        } catch (e) {
            await t.rollback();
            logger.error("Error in creating booking model : ", e);
            return { success: false, message: e.message }
        }
    },

    async fetchBookingOnRowAndSeat(rowId, seatNo) {
        try {
            const Booking = await this.getBookingModel();
            const bookingDetails = await Booking.findOne({
                where: {
                    rowId: rowId,
                    seatNo: seatNo,
                },
                raw: true,
            });
            if (!bookingDetails) {
                return { success: true, message: "No booking model found" };
            }
            return { success: false, message: bookingDetails };
        } catch (e) {
            return { success: false, message: e.message }
        }
    },

    async getBooking(bookingId) {
        try {
            const Booking = await this.getBookingModel();
            const booking = await Booking.findByPk(bookingId, {
                raw: true,
                attributes: ['bookingId', 'seatNo', 'rowId', 'bookedBy'],
            });
            if (!booking) {
                return { success: false, message: `No booking model found for ${bookingId}` };
            }
            return { success: true, message: booking };
        } catch (e) {
            logger.error(`Error in fetching booking model for ${bookingId} `, e);
        }
    }
};

module.exports = BookingService;