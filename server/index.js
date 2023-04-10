// General purpose blue-tooth SPP server

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Bluetooth} from './bluetooth/bluetooth.js';

const config = {
  spp: {
    deviceMAC: null,
    maxConnectAttempts: 3,
    connectionAttemptDelay: 500,
    connectionTimeout: 10000,
  },
  http: {
    port: 9527,
  },
};

(async function () {
  const args = process.argv.slice(2);
  if(!args[0]) {
    console.log(`No device MAC address.
    Please use \`npm run server -- <MAC>\` to set the MAC address manually.`);
    process.exit(-1);
  }

  config.spp.deviceMAC = args[0].replace(/[: ]/mg, '');

  const bluetooth = new Bluetooth(config.spp);

  // Let's try connecting
  const connection = await bluetooth.connect();

  if(!connection) {
    console.error('Failed to connect.');
    process.exit(-1);
  }

  connection.on('data', (buffer) => {
    const result = buffer.toString('hex');
    console.log('<==', result);
  });

  const app = express();
  app.use(cors());
  app.use(bodyParser.text({type: '*/*'}));

  app.get('/', (req, res) => {
    res.send(config);
  });

  app.get('/:command', async (req, res) => {
    try {
      const {command} = req.params;
      const result = await bluetooth.writeMessage(command);
      res.send({status: 'OK', result});
    } catch (error) {
      res.send({status: 'ERROR', error: error.message});
    }
  });

  app.post('/send', async (req, res) => {
    try {
      const {payload} = JSON.parse(req.body);
      if(payload) {
        const result = await bluetooth.writeMessage(payload);
        res.send({status: 'OK', result});
      } else {
        res.send({status: 'OK'});
      }
    } catch (error) {
      res.send({status: 'ERROR', error: error.message});
    }
  });

  app.listen(config.http.port);

  process.on('SIGINT', (code) => {
    console.log('Disconnecting…');
    connection.close();
    process.exit(0);
  });
}());