const db = require('../../utils/database/db-init').db;
const logger = require('../../utils/logger');
const getModel = require('../../utils/database/getModel');
const generateOtp = require("../../utils/generateOtp");
const UserMasterService = require("../auth/user-master");
const sendEmailToQueue = require("../../utils/email/email-queue");

const OtpDetailsService = {

    async getOtpDetails(){
        return await getModel(db, "notifications", "otp_details");
    },

    async saveOtpDetails(email){
        const t = await db.sequelize.transaction();
        try {
            const { success, message: OtpDetails } = await this.getOtpDetails();
            if (!success) {
                logger.error("Otp Details model not initialized");
                return { success: false, message: OtpDetails };
            }
            const userDetails = await UserMasterService.getUserByEmail(email);
            if (!userDetails.success) {
                return { success: false, message: userDetails.message };
            }
            let otpDetails = {};
            otpDetails.userId = userDetails.message.userId;
            const otp = generateOtp();
            otpDetails.otp = otp;
            const savedOtpDetails = await OtpDetails.create(otpDetails, {
                transaction: t,
            });
            await t.commit();
            const emailData = {
                to: email,
                subject: 'OTP',
                html: `<p>Hi <b>${userDetails.message.firstName + ' ' + userDetails.message.secondName || 'User'}</b>,\n\n Your OTP is <b>${otp}</b> <br> It is valid for 15 minutes.</p>`
            };

            // Send email job to RabbitMQ
            await sendEmailToQueue(emailData);
            return { success: true, message: savedOtpDetails.dataValues };
        } catch (e) {
            logger.error(`Error occurred while saving otp details: `, e);
            await t.rollback();
            return { success: false, message: e };
        }
    }
}

module.exports = OtpDetailsService;