const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserMasterService = require('../services/auth/user-master');
const logger = require('../utils/logger');

async function login(req, res) {
    try {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: "Invalid request: Request body is missing"
            });
        }
        const { userEmail, password } = req.body;
        if (!userEmail || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid request: Email and password are required"
            });
        }
        const user = await UserMasterService.getUserByEmail(userEmail);
        if (!user.success) {
            return res.status(400).send(user);
        }
        const isPasswordValid = await bcrypt.compare(password, user.message.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                success: false,
                message: "Authentication failed: Invalid password"
            });
        }
        const token = jwt.sign({ userId: user.message.userId }, process.env.JWT_SIGNING_KEY, {
            expiresIn: '1h'
        });
        logger.info(`User with userId ${user.message.userId} logged in successfully`);
        return res.status(200).send({
            token: token,
            fullName: `${user.message.firstName} ${user.message.secondName}${user.message.otherName ? ' ' + user.message.otherName : ''}`,
            message: "Authentication successful"
        });
    } catch (e) {
        logger.error(`Error while logging in user: ${e.message}`, e);
        return res.status(500).send({
            success: false,
            message: `Server error: ${e.message}`
        });
    }
}

module.exports = {
    login,
};