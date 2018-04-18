const Influx = require('influx');
let influx = null;

const {
  INFLUX_HOST: host,
  INFLUX_PORT: port,
  INFLUX_DB: database,
} = process.env;

module.exports = {
  connect: () => {
    influx = new Influx.InfluxDB({
      host,
      port,
      database,
      schema: [
        {
          measurement: 'sensor_data',
          fields: {
            value: Influx.FieldType.FLOAT,
          },
          tags: [
            'sensor'
          ]
        }
      ]
    });

    return influx;
  }
};
