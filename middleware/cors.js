const cors = (req, res, next) => {
    const allowedOrigins = [
        // "https://expenses.mpccloud.com",
        // "https://expensescug.mpccloud.com",
        // "https://mpcexpenses.mpccloud.com",
        // "ldap://mpccloudads.com",
        "http://localhost:3000"
    ];

    const origin = req.get("Origin");
    //console.log("origin", origin);
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        // res.setHeader("Allow", "GET, POST");
        // res.setHeader("Public", "GET, POST");
        // res.setHeader("Content-Security-Policy", "default-src 'self'");

        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
    }
    next();
}

module.exports = cors