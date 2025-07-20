require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const logger = require('../logger');
const db = require('../../utils/database/db');
const initializeDatabase = require('../../database-details/initialize-database');
const { Sequelize, DataTypes } = require('sequelize');

async function consumeQueue() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'email_queue';

    await channel.assertQueue(queue, { durable: true });
    logger.info('Waiting for email jobs in queue...');

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const emailData = JSON.parse(msg.content.toString());
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT),
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                await transporter.sendMail(emailData);

                const EmailMasterService = require('../../services/notifications/email-master');
                await EmailMasterService.saveEmailMaster(emailData);

                logger.info('Email sent to:', emailData.to);
                channel.ack(msg);
            } catch (error) {
                logger.error('Error sending email:', error);
            }
        }
    }, { noAck: false });
}

setTimeout(() => {
    (async () => {
        try {
            await db.sequelize.authenticate();
            await initializeDatabase(db.sequelize, DataTypes, db);
            logger.info("Consumer DB models initialized");
            consumeQueue();
        } catch (err) {
            logger.error("Failed to initialize DB models in consumer:", err);
            process.exit(1);
        }
    })();
}, 1000);