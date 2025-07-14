const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let decodedToken;
    const header = req.get('Authorization');
    if (!header) {
        const error = new Error('Authentication failed: No token provided');
        error.statusCode = 401;
        throw error;
    }
    const token = header.split(' ')[1];
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SIGNING_KEY);
    } catch (e) {
        const error = new Error('Authentication failed: token expired.');
        error.statusCode = 401;
        throw error;
    }
    if (!decodedToken) {
        const error = new Error('Authentication failed: Invalid token');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};