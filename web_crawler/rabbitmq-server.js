const amqplib = require('amqplib');


class RabbitMqService{
    // 15672

    constructor(){
       
      this.conn
      this.channel
    }

    async start(){
       this.conn = await amqplib.connect({
        host: 'localhost',
        port: 5672,
        username: 'guest',
        password: 'guest'
      })
       this.channel = await this.conn.createChannel();
    }

    async publishInQueue(queue, message){
        console.log("publicando na fila")
        return this.channel.sendToQueue(queue, Buffer.from(message))
    }

    async createQueue(queue){
      this.channel.assertQueue(queue, {
        durable: false
      });
    }

}

module.exports = RabbitMqService