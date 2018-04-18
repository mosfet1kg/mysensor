const amqp = require('amqplib/callback_api');

const {
  RABBITMQ_HOST: hostname,
  RABBITMQ_PORT: port,
  RABBITMQ_USER: username,
  RABBITMQ_PASS: password,
} = process.env;

let conn = null;

module.exports = {
  connect: ( callback ) => {
    amqp.connect({
      protocol: 'amqp',
      hostname,
      port,
      username,
      password,
      locale: 'en_US',
      vhost: '/'
    }, (error, connection) => {
      if ( error ) {
        return callback(error);
      } // end if

      conn = connection;

      if ( callback ) callback(null);
    });
  },
  receiveData: ({ queueName }, callback) => {
    conn.createChannel((err, ch) => {
      if ( err ) {
        return console.log( err );
      }

      ch.assertQueue(queueName, {durable: false});

      console.log(' [x] Awaiting RPC requests');

      ch.consume(queueName, (msg) => {

        if ( msg === null ) {
          return
        }

        const data = msg.content.toString();

        callback( JSON.parse(data) );
      });
    });
  },
  sendData: ({ queueName, data }) => {
    conn.createChannel((err, ch) => {
      if ( err ) {
        return console.log( err );
      }

      ch.sendToQueue(queueName, new Buffer( JSON.stringify( data )));
    });
  }
};
