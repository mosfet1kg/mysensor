require('dotenv').config();
const sensorLib = require("node-dht-sensor");
const rabbitmq = require('./helpers/rabbitmq');

rabbitmq.connect();

const sensor = {
  initialize: () => {
    return sensorLib.initialize(11, 12);
  },
  read: ( callback ) => {
    const data = sensorLib.read();
    // const data = sensorLib.read(this.sensors[0].type, this.sensors[0].pin);

    callback({
      temperature: data.temperature.toFixed(1),
      humidity:  data.humidity.toFixed(1),
    })
  }
};

if ( sensor.initialize() ) {
  setInterval(() => {
    sensor.read(( data ) => {
      console.log( data.temperature + "°C, " + data.humidity + "%");

      rabbitmq.sendData({ queueName: 'sensor_queue', data })
    });
  }, 2000);
} else {
  console.warn('Failed to initialize sensor');
}
