require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const logger = require('../logger');
const db = require('../../utils/database/db');
const initializeDatabase = require('../../database-details/initialize-database');
const { Sequelize, DataTypes } = require('sequelize');
const EmailMasterService = require('../../services/notifications/email-master');

async function consumeQueue() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'email_queue';

    await channel.assertQueue(queue, { durable: true });
    logger.info('Waiting for email jobs in queue...');

    channel.consume(
        queue,
        async (msg) => {
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

                    const result = await transporter.sendMail(emailData);
                    emailData.messageId = result.messageId;
                    // emailData.success = !!(result.accepted || result.accepted.length > 0);
                    logger.info('Email sent to:' + emailData.to);
                } catch (error) {
                    // emailData.success = false;
                    emailData.error = error;
                    logger.error('Error sending email to:', emailData.to, error);
                } finally {
                    // Save email attempt result, whether success or failure
                    await EmailMasterService.saveEmailMaster(emailData);
                    channel.ack(msg);
                }
            }
        },
        { noAck: false }
    );
}

setTimeout(() => {
    (async () => {
        try {
            await db.sequelize.authenticate();
            await initializeDatabase(db.sequelize, DataTypes, db);
            logger.info('Consumer DB models initialized');
            consumeQueue();
        } catch (err) {
            logger.error('Failed to initialize DB models in consumer:', err);
            process.exit(1);
        }
    })();
}, 1000);