const UAParser = require("ua-parser-js");

const getDeviceInfo = async (req) => {
    const ua = req.headers['user-agent'];
    const parser = new UAParser(ua);
    const result = parser.getResult()

    return {
        deviceType: result.device.type || null,
        deviceVendor: result.device.vendor || null,
        deviceModel: result.device.model || null,
        os: result.os.name || null,
        osVersion: result.os.version || null,
        browser: result.browser.name || null,
        browserVersion: result.browser.version || null
    };
}

module.exports = getDeviceInfo;