import {
  connectRabbitMQ,
  sendToQueue,
  consumeQueue,
} from "../testmsq/rabbitmq.model.js";


export const startComsumer = async () => {
    
await consumeQueue("workertest1", async (message) => {
  console.log("Recived The message!!!!");
  const productId = message.productId;
  console.log(productId);
});

}