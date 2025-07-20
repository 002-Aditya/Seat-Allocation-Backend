require('dotenv').config();
const amqp = require('amqplib');
const logger = require('../logger');

async function sendEmailToQueue(emailData) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'email_queue';

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), { persistent: true });
        setTimeout(() => connection.close(), 500);
    } catch (err) {
        logger.error('Failed to enqueue email:', err);
    }
}

module.exports = sendEmailToQueue;