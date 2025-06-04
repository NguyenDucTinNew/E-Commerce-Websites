// rabbitmq.model.js
import amqplib from "amqplib";

const RABBITMQ_URL = process.env.AMQP_URL_CLOUD;

let conn = null;
let channel = null;

export const connectRabbitMQ = async () => {
  if (!conn) {
    conn = await amqplib.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
  }
  return { conn, channel };
};

export const sendToQueue = async (queueName, message) => {
  const { channel } = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

export const consumeQueue = async (queueName, callback) => {
  const { channel } = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel.ack(msg);
    }
  });
};
