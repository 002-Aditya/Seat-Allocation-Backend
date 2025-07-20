require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const logger = require('../logger');

async function consumeQueue() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'email_queue';

    await channel.assertQueue(queue, { durable: true });
    logger.info('Waiting for email jobs in queue...');

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const emailData = JSON.parse(msg.content.toString());
            console.log("EMAIL_USER:", process.env.EMAIL_USER);
            console.log("EMAIL_PASS length:", process.env.EMAIL_PASS.length);
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT),
                    // Secure to be false for port 587 as it uses plain text
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
                await transporter.sendMail(emailData);
                logger.info('Email sent to:', emailData.to);
                channel.ack(msg);
            } catch (error) {
                logger.error('Error sending email:', error);
                // Retry
                // channel.nack(msg);
            }
        }
    }, { noAck: false });
}

consumeQueue();