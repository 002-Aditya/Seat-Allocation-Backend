const GenerateOtpService = require('../services/notifications/otp-details');
const logger = require('../utils/logger');

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

module.exports = {
    generateOtp,
};