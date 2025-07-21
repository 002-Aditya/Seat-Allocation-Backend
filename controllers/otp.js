const GenerateOtpService = require('../services/notifications/otp-details');
const { generateToken } = require('../utils/generate-jwt-token');
const logger = require("../utils/logger");

const generateOtp = async (req, res) => {
    try {
        const otpDetails = req.body;
        const email = otpDetails.email;
        const generatedOtp = await GenerateOtpService.saveOtpDetails(email);
        if (!generatedOtp.success) {
            return res.status(500).send(generatedOtp);
        }
        let response = {};
        response.message = {};
        return res.status(201).send({ success: true, message: `OTP has been sent to: ${email}` });
    } catch (e) {
        return res.status(500).send({ success: false, message: e.message });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const otpDetails = req.body;
        const { otp, email } = otpDetails;
        const verifiedOtp = await GenerateOtpService.verifyOtp(email, otp);
        if (!verifiedOtp.success) {
            return res.status(400).send(verifiedOtp);
        }

        // After successfully verifying OTP, generate JWT Token
        const token = generateToken({ userId: verifiedOtp.message.userId });
        logger.info(`User with userId ${verifiedOtp.message.userId} logged in successfully`);

        return res.status(201).send({
            token: token,
            fullName: `${verifiedOtp.message.firstName} ${verifiedOtp.message.secondName}${verifiedOtp.message.otherName ? ' ' + verifiedOtp.message.otherName : ''}`,
            message: "Authentication successful"
        });
    } catch (e) {
        return res.status(500).send({ success: false, message: e.message });
    }
}

module.exports = {
    generateOtp,
    verifyOtp,
};