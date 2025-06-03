import amqplib from "amqplib";
import { json } from "express";

const sendQueue = async ({ msg }) => {
  try {
    const url =
      "amqps://zoazyftn:3lVa2N4tVNE-whk5fJ4Q8NBoYGE_e5GN@armadillo.rmq.cloudamqp.com/zoazyftn";
    // create a connection to RabbitMQ
    const conn = await amqplib.connect(url);
    //  creat a channel
    const channel = await conn.createChannel();
    //create a name queue
    const queueName = "testQueue";
    // create a queue if it does not exist
    await channel.assertQueue(queueName, {
      durable: true, // ensure the queue is durable
    });
    // send a message to the queue
    channel.sendToQueue(queueName, Buffer.from(msg), {
      persistent: true, // ensure the message is persistent (still exists after rabiitmq restart)
    });
  } catch (err) {
    console.error("Error sending message to queue:", err);
  }
};

sendQueue({ msg: "Test 1" });
