require('dotenv').config();
const influx = require('./helpers/influx').connect();
const rabbitmq = require('./helpers/rabbitmq');

rabbitmq.connect(( error ) => {
  if ( error ) {
    return console.log( error );
  } // end if

  rabbitmq.receiveData({ queueName: 'sensor_queue'}, async ( data ) => {

    const {
      temperature, humidity
    } = data;

    console.log( data );

    await influx.writePoints([
      {
        measurement: 'sensor_data',
        tags: { sensor: 'thermometer' },
        fields: { value: parseFloat(temperature) },
      },
      {
        measurement: 'sensor_data',
        tags: { sensor: 'hygrometer' },
        fields: { value: parseFloat(humidity) },
      }
    ])
  });
});


// influx.writePoints([
//   {
//     measurement: 'sensor_data',
//     tags: { sensor: 'thermometer' },  //hygrometer
//     fields: { value: 10.5 },
//   }
// ]).then(() => {
//   return influx.query(`
//     select * from sensor_data
//     where sensor = \'thermometer\'
//     order by time desc
//     limit 10
//   `)
// }).then(rows => {
//   rows.forEach(row => console.log(JSON.stringify(row)))
// }).catch(error => console.log(error.message));
