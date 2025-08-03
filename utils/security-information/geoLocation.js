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
const geoLocation = (ip) => {
    return geoIp.lookup(ip);
}

module.exports = geoLocation;