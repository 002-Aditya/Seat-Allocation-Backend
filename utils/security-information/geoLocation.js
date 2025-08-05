const geoIp = require("geoip-lite");

/*
* Output would be returned in this format
*{
   range: [ 1742244864, 1742245375 ],
   country: 'IN',
   region: 'DL',
   eu: '0',
   timezone: 'Asia/Kolkata',
   city: 'New Delhi',
   ll: [ 28.652, 77.1663 ],
   metro: 0,
   area: 5
}
* */
const geoLocation = async (ip) => {
    if (ip === '::1' || ip === '127.0.0.1') {
        return {
            range: [0, 0],
            country: 'LOCAL',
            region: 'LOCAL',
            city: 'Localhost',
            timezone: 'Etc/UTC',
            ll: [0, 0],
            metro: 0,
            area: 0
        };
    }
    return geoIp.lookup(ip);
}

module.exports = geoLocation;