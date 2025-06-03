import amqplib from "amqplib";
import { json } from "express";

const recivedQueue = async () => {
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
    await channel.consume(
      queueName,
      (msg) => {
        if (msg !== null) {
          console.log("Received message:", msg.content.toString());
        } else {
          console.log("No messages in queue");
        }
      },
      {
        noAck: true, // ensure messages are acknowledged after processing ; if it is true , the message awlays be deleted out of the queue
      }
    );
  } catch (err) {
    console.error("Error sending message to queue:", err);
  }
};

recivedQueue();
