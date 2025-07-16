const db = require("../../utils/db-init");
const logger = require("../../utils/logger");
const { filterData } = require('../../utils/filter-data');
const getModel = require("../../utils/getModel");

const BookingService = {

    async getBookingModel() {
        return await getModel(db, "allotment", "bookings");
    },

    async validateBooking(rowId, seatNo, bookingDate, userId) {
        const fetchBookingDetails = await this.fetchBookingOnRowAndSeat(rowId, seatNo);
        if (!fetchBookingDetails.success) {
            return fetchBookingDetails;
        }

        const booking = new Date(bookingDate);
        const current = new Date();
        booking.setHours(0, 0, 0, 0);
        current.setHours(0, 0, 0, 0);

        if (booking < current) {
            return { success: false, message: "Booking date cannot be less than current date" };
        }
        // Check if user is sitting on some other seat for the same day
        const validateSeating = await this.getSeatOnUserIdAndDate(userId, bookingDate);
        if (!validateSeating.success) {
            return { success: false, message: validateSeating.message };
        }
        return { success: true, message: `Data verified` };
    },

    async createBooking(booking, userId) {
        const t = await db.sequelize.transaction();
        try {
            const { success, message: Booking } = await this.getBookingModel();
            if (!success) {
                return { success: false, message: "Bookings model not found" };
            }
            const validate = await this.validateBooking(booking.rowId, booking.seatNo, booking.bookingDate, userId);
            if (!validate.success) {
                await t.rollback();
                return validate;
            }
            const filterInput = await filterData([booking]);
            filterInput[0].createdBy = userId;
            const createdInstance = await Booking.create(filterInput[0], { transaction: t });
            const plainData = createdInstance.get({ plain: true });
            const filteredOutput = await filterData([plainData]);
            logger.info(`A seat has been booked for user, ${filteredOutput[0].bookedFor} with the booking ID ${filteredOutput[0].bookingId}`);
            await t.commit();
            return { success: true, message: filteredOutput[0] };
        } catch (e) {
            await t.rollback();
            logger.error("Error in creating booking model : ", e);
            return { success: false, message: e.message }
        }
    },

    /*
    * Deprecated
    * */
    // async updateBooking(bookingId, booking, userId) {
    //     const t = await db.sequelize.transaction();
    //     try {
    //         const { success, message: Booking } = await this.getBookingModel();
    //         if (!success) {
    //             return { success: false, message: Booking };
    //         }
    //         const validate = await this.validateBooking(booking.rowId, booking.seatNo, booking.bookingDate);
    //         if (!validate.success) {
    //             await t.rollback();
    //             return validate;
    //         }
    //         const filterInput = await filterData([booking]);
    //         filterInput[0].modifiedBy = userId;
    //         filterInput[0].modifiedOn = new Date();
    //         const updatedInstance = await Booking.update(filterInput[0], {
    //             where: {
    //                 bookingId: bookingId,
    //             },
    //             plain: true
    //         });
    //         const filteredOutput = await filterData([updatedInstance]);
    //         logger.info(`Booking has been updated for ${bookingId} by ${userId}`);
    //         await t.commit();
    //         return { success: true, message: filteredOutput[0] };
    //     } catch (e) {
    //         await t.rollback();
    //         logger.error(`Error occurred while updating booking : ${bookingId}`, e);
    //         return { success: false, message: e.message };
    //     }
    // },

    async fetchBookingOnRowAndSeat(rowId, seatNo) {
        try {
            const { success, message: Booking } = await this.getBookingModel();
            if (!success) {
                return { success: false, message: "Bookings model not found" };
            }
            const bookingDetails = await Booking.findOne({
                where: {
                    rowId: rowId,
                    seatNo: seatNo,
                    isActive: true
                },
                raw: true,
            });
            if (!bookingDetails) {
                return { success: true, message: "No booking model found" };
            }
            return { success: false, message: `The seat is already booked.` };
        } catch (e) {
            return { success: false, message: e.message }
        }
    },

    async getBookingOnRowId(rowId) {
        try {
            const { success, message: Booking } = await this.getBookingModel();
            if (!success) {
                return { success: false, message: "Bookings model not found" };
            }
            const booking = await Booking.findAll({
                where: {
                    rowId: rowId,
                    isActive: true
                },
                raw: true,
                attributes: ['bookingId', 'seatNo', 'rowId', 'bookedFor'],
            });
            if (!booking) {
                return { success: false, message: `Details not found for ${rowId}` };
            }
            return { success: true, message: booking };
        } catch (e) {
            logger.error(`Error in fetching booking model for ${rowId} `, e);
        }
    },

    async findAllBookings() {
        try {
            const { success, message: Booking } = await this.getBookingModel();
            if (!success) {
                return { success: false, message: "Bookings model not found" };
            }
            const bookings = await Booking.findAll({
                where: {
                    isActive: true,
                }
            });
            return { success: true, message: bookings };
        } catch (e) {
            return { success: false, message: e.message }
        }
    },

    async getSeatOnUserId(userId) {
        try {
            const { success, message: Booking } = await this.getBookingModel();
            if (!success) {
                return { success: false, message: "Bookings model not found" };
            }
            const booking = await Booking.findOne({
                where: {
                    bookedFor: userId,
                    isActive: true
                }
            });
            return { success: true, message: booking };
        } catch (e) {
            logger.error(`Error in fetching seat of user, ${userId} `, e);
            return { success: false, message: e.message }
        }
    },

    async getSeatOnUserIdAndDate(userId, bookingDate) {
        try {
            const { success, message: Booking } = await this.getBookingModel();
            if (!success) {
                return { success: false, message: "Bookings model not found" };
            }
            const booking = await Booking.findOne({
                where: {
                    bookedFor: userId,
                    isActive: true,
                    bookingDate: bookingDate
                },
                raw: true,
            });
            if (booking) {
                return { success: false, message: `User has already been booked for seat no ${booking.seatNo} on row ${booking.rowId}` };
            }
            return { success: true, message: booking };
        } catch (e) {
            logger.error(`Error in fetching seat of user, ${userId} `, e);
            return { success: false, message: e.message }
        }
    }
};

module.exports = BookingService;