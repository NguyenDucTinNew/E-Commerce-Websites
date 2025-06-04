// rabbitmq.model.js
import amqplib from "amqplib";

const RABBITMQ_URL =
  "amqps://zoazyftn:3lVa2N4tVNE-whk5fJ4Q8NBoYGE_e5GN@armadillo.rmq.cloudamqp.com/zoazyftn";

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
