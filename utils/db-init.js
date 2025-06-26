const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./logger');
const initializeDatabase = require('../database-details/initialize-database');

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

// Initialize models after sync
db.sequelize.sync({ force: true }).then(async () => {
    await initializeDatabase(sequelize, DataTypes, db);
    logger.info('database -> Yes resync done');
}).catch((err) => {
    logger.error('database -> error', err);
});

module.exports = db;