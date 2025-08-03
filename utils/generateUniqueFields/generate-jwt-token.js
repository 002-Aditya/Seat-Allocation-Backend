const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for the given payload.
 * @param {Object} payload - Payload to embed in the token
 * @param {String} expiresIn - Token expiration time
 * @returns {String} - Signed JWT token
 */
function generateToken(payload, expiresIn = '1h') {
    if (!process.env.JWT_SIGNING_KEY) {
        throw new Error('JWT_SIGNING_KEY is not defined in environment variables');
    }

    return jwt.sign(payload, process.env.JWT_SIGNING_KEY, { expiresIn });
}

module.exports = {
    generateToken,
};