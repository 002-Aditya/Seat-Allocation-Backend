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
    },

    async getOtp(email){
        try {
            const { success, message: OtpDetails } = await this.getOtpDetails();
            if (!success) {
                logger.error("Otp Details model not initialized");
                return { success: false, message: OtpDetails };
            }
            const otpDetails = await OtpDetails.findOne({ where: { email: email, isVerified: false }, raw: true });
            if (!otpDetails) {
                return { success: false, message: `Otp details not found for email, ${email}` };
            }
            return { success: true, message: otpDetails };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    async updateOtp(otpId, otpDetails){
        const t = await db.sequelize.transaction();
        try {
            const { success, message: OtpDetails } = await this.getOtpDetails();
            if (!success) {
                await t.rollback();
                logger.error("Otp Details model not initialized");
                return { success: false, message: OtpDetails };
            }
            const updateOtpDetails = await OtpDetails.update(otpDetails, {
                where: { otpId: otpId },
                transaction: t,
            });
            await t.commit();
            return { success: true, message: updateOtpDetails.get({ plain: true }) };
        } catch (e) {
            await t.rollback();
            logger.error(`Error occurred while updating otp details: `, e);
            return { success: false, message: e };
        }
    },

    async verifyOtp(email, otp){
        try {
            const correctOtp = await this.getOtp(email);
            if (!correctOtp.success) {
                return correctOtp;
            }
            const currentTime = new Date();
            if (parseInt(correctOtp.message.otp) !== otp || (currentTime < correctOtp.message.expiredAt)) {
                return { success: false, message: "Incorrect OTP" };
            }
            let updateOtpDetails = {};
            updateOtpDetails.isVerified = true;
            await this.updateOtp(correctOtp.message.otpId, updateOtpDetails);
            return { success: true, message: "OTP verified successfully" };
        } catch (e) {
            return { success: false, message: e.message };
        }
    }
}

module.exports = OtpDetailsService;