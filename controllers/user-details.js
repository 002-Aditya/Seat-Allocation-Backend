const UserMasterService = require('../services/auth/user-master');
const logger = require('../utils/logger');
const sendEmailToQueue = require("../utils/email/email-queue");

async function createUser(req, res) {
    try {
        const userDetails = req.body;
        if (!userDetails || userDetails.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid user details" });
        }
        const createdUser = await UserMasterService.createUser(userDetails);
        if (!createdUser.success) {
            return res.status(500).send(createdUser);
        }

        const emailData = {
            to: userDetails.email,
            subject: 'Welcome to Our Platform!',
            text: `<p>Hi <b>${userDetails.firstName + ' ' + userDetails.secondName || 'User'}</b>,\n\nThank you for registering. <br> Your account has been successfully created.</p>`
        };

        // Send email job to RabbitMQ
        await sendEmailToQueue(emailData);
        return res.status(201).send(createdUser.message);
    } catch (e) {
        logger.error(`Error while creating user : `, e);
        return res.status(500).json({ success: false, message: e.message });
    }
}

async function updateUserDetails(req, res) {
    try {
        const userId = req.userId;
        const userDetails = req.body;
        if (!userDetails || userDetails.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid user details" });
        }
        delete userDetails.userId;
        const updatedUser = await UserMasterService.modifyUser(userId, userDetails);
        if (!updatedUser.success) {
            return res.status(500).send(updatedUser);
        }
        return res.status(201).send(updatedUser.message);
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
}

module.exports = {
    createUser,
    updateUserDetails,
};