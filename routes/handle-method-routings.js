const logger = require('../utils/logger');

const handleMethodRoutings = (req, res, details) => {
    const { type } = req.query;
    const controller = details[type];
    if (controller) {
        return controller(req, res);
    } else {
        logger.error(`Invalid method : ${type}`);
        return res.status(404).json({ success: false, message: "Invalid method" });
    }
};

module.exports = handleMethodRoutings;