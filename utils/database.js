const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./logger');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        // dialectOptions: {
        //     ssl: {
        //         require: false,
        //         rejectedUnauthorized: false // Add this line if you want to avoid self-signed certificate errors
        //     }
        // }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({ force: false }).then(async () => {
    logger.info("database -> Yes resync done");
}).catch((err) => {
    logger.info("database -> error", err);
});

module.exports = db;