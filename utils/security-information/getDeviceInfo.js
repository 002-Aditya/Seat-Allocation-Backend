const UAParser = require("ua-parser-js");

const getDeviceInfo = async (req) => {
    try {
        const ua = req.headers['user-agent'];
        console.log("User Agent: " + ua);
        const parser = new UAParser(ua);
        const result = parser.getResult()

        const deviceInfo = {
            deviceType: result.device.type || null,
            deviceVendor: result.device.vendor || null,
            deviceModel: result.device.model || null,
            os: result.os.name || null,
            osVersion: result.os.version || null,
            browser: result.browser.name || null,
            browserVersion: result.browser.version || null
        };
        return { success: true, message: deviceInfo };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

module.exports = getDeviceInfo;