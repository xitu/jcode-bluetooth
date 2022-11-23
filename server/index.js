// General purpose blue-tooth SPP server

import express from 'express';
import BluetoothSerialPort from 'node-bluetooth-serial-port';
import bodyParser from 'body-parser';

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function unhexlify(str) {
  let result = '';
  if(str.length % 2 !== 0) {
    throw new Error('The string length is not a multiple of 2');
  }
  for(let i = 0, l = str.length; i < l; i += 2) {
    const toHex = parseInt(str.substr(i, 2), 16);
    if(isNaN(toHex)) {
      throw new Error('str contains non hex character');
    }
    result += String.fromCharCode(toHex);
  }
  return result;
}

function stringToBuffer(message) {
  const bufferArray = [];
  message.match(/.{1,1332}/g).forEach((part) => {
    bufferArray.push(Buffer.from(unhexlify(part), 'binary'));
  });
  return bufferArray;
}

/**
 * Write a buffer to the device
 */
function write(connection, buffer) {
  return new Promise((resolve, reject) => {
    connection.write(buffer, (error, bytes) => {
      console.log('==>', buffer, bytes);
      return error ? reject(error) : resolve(bytes);
    });
  });
}

async function writeMessage(connection, command) {
  const buffers = stringToBuffer(command);
  const status = [];
  // eslint-disable-next-line no-restricted-syntax
  for(const buffer of buffers) {
    // eslint-disable-next-line no-await-in-loop
    status.push(await write(connection, buffer));
  }
  return status;
}

function defer() {
  let resolve;
  let reject;
  // eslint-disable-next-line promise/param-names
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    resolve,
    reject,
    promise,
  };
}

let signal = null;

const SPP_Port = new BluetoothSerialPort.BluetoothSerialPort();
function connect() {
  return new Promise((resolve, reject) => {
    // Find the device
    setTimeout(() => {
      reject(new Error('Connection timeout'));
    }, config.spp.connectionTimeout);

    SPP_Port.findSerialPortChannel(config.spp.deviceMAC, (channel) => {
      // Connect to the device
      SPP_Port.connect(config.spp.deviceMAC, channel, () => {
        // We connected, resolve
        resolve(SPP_Port);
      }, () => reject(new Error('Cannot connect')));
    }, () => reject(new Error('Not found')));
  });
}

(async function () {
  const args = process.argv.slice(2);
  if(!args[0]) {
    console.log(`No device MAC address.
    Please use \`npm run server -- <MAC>\` to set the MAC address manually.`);
    process.exit(-1);
  }

  config.spp.deviceMAC = args[0].replace(/[: ]/mg, '');

  // Let's try connecting
  let attempts = 0;
  let connection = null;
  while(attempts < config.spp.maxConnectAttempts) {
    console.log('connection attempt %d/%d', attempts, config.spp.maxConnectAttempts);
    try {
      // eslint-disable-next-line no-await-in-loop
      connection = await connect();
      break;
    } catch (error) {
      console.error('error', error.message);
      attempts++;
      // eslint-disable-next-line no-await-in-loop
      await sleep(config.connectionAttemptDelay);
    }
  }
  if(!connection) {
    console.error('Failed to connect.');
    connection.close();
    process.exit(-1);
  }

  connection.on('data', (buffer) => {
    const result = buffer.toString('hex');
    console.log('<==', result);
    if(signal) signal.resolve(result);
  });

  const app = express();
  app.use(bodyParser.text({type: '*/*'}));

  app.get('/', (req, res) => {
    res.send(config);
  });

  app.get('/:command', async (req, res) => {
    const {command} = req.params;
    if(signal) signal.resolve();
    if(command) {
      signal = defer();
      writeMessage(connection, command);
      const result = await Promise.any(
        [signal.promise, sleep(500)],
      );
      res.send({status: 'OK', result});
    } else {
      res.send({status: 'OK'});
    }
  });

  app.post('/send', async (req, res) => {
    try {
      const {payload} = JSON.parse(req.body);
      if(signal) signal.resolve();
      if(payload) {
        signal = defer();
        writeMessage(connection, payload);
        const result = await Promise.any(
          [signal.promise, sleep(500)],
        );
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
    if(connection) connection.close();
    process.exit(0);
  });
}());