const db = require('./db');
const { Client } = require('pg');
const logger = require('../logger');
const initializeDatabase = require('../../database-details/initialize-database');

async function createDatabaseIfNotExists() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await client.connect();
        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [process.env.DB_DATABASE]
        );

        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${process.env.DB_DATABASE}"`);
            logger.info(`Database ${process.env.DB_DATABASE} created successfully`);
        } else {
            logger.info(`Database ${process.env.DB_DATABASE} already exists`);
        }
    } catch (err) {
        logger.error('Error creating database', err);
        throw err;
    } finally {
        await client.end();
    }
}

async function initializeDb() {
    await createDatabaseIfNotExists();
    await db.sequelize.sync({ force: false });
    await initializeDatabase(db.sequelize, db.Sequelize, db);
    logger.info('Database initialization completed');
}

module.exports = { db, initializeDb };