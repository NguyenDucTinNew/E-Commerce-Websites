import amqplib from 'amqplib';

const RABBITMQ_URL = 'amqp://rabbitmq'; // URL từ docker-compose

//create a connection to RabbitMQ
export const connectRabbitMQ = async () => {
  const conn = await amqplib.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  return { conn, channel };
};

//send message to queue
export const sendToQueue = async (queueName, message) => {
  const { channel } = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
};

// receive message from queue
export const consumeQueue = async (queueName, callback) => {
  const { channel } = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (msg) => {
    if (msg) {
      callback(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
};s