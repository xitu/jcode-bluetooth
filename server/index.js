// General purpose blue-tooth SPP server

import express from 'express';
import BluetoothSerialPort from 'node-bluetooth-serial-port';
import bodyParser from 'body-parser';
import cors from 'cors';

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

let connection = null;

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

const BUFFER_SIZE = 1332;
function stringToBuffer(message) {
  const bufferArray = [];
  const regExp = new RegExp(`.{1,${BUFFER_SIZE}}`, 'g');
  message.match(regExp).forEach((part) => {
    bufferArray.push(Buffer.from(unhexlify(part), 'binary'));
  });
  return bufferArray;
}

let tempBuffer;

/**
 * Write a buffer to the device
 */
function write(buffer) {
  return new Promise((resolve, reject) => {
    if(!connection) {
      tempBuffer = buffer;
      return reject(new Error('Not connected'));
    }
    connection.write(buffer, (error, bytes) => {
      console.log('==>', error, buffer, bytes);
      if(error) {
        connection.close(); // 重新连接
        connection = null;
        tryConnect(1000).then((conn) => {
          console.log('reconnected!');
          connection = conn;
          if(tempBuffer) {
            return conn.write(tempBuffer, () => {
              tempBuffer = null;
            });
          }
        });
      }
      return error ? reject(error) : resolve(bytes);
    });
  });
}

async function writeMessage(command) {
  const buffers = stringToBuffer(command);
  const status = [];
  // eslint-disable-next-line no-restricted-syntax
  for(const buffer of buffers) {
    // eslint-disable-next-line no-await-in-loop
    status.push(await write(buffer));
  }
  return status;
}

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

async function tryConnect(times = config.spp.maxConnectAttempts) {
  let attempts = 0;
  for(let i = 0; i < times; i += 1) {
    try {
      console.log('connection attempt %d/%d', attempts, times);
      // eslint-disable-next-line no-await-in-loop
      connection = await connect();
      break;
    } catch (error) {
      console.error('error', error.message);
      attempts++;
      // eslint-disable-next-line no-await-in-loop
      await sleep(config.spp.connectionAttemptDelay);
    }
  }
  return connection;
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
  connection = await tryConnect();

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
      const result = await writeMessage(command);
      res.send({status: 'OK', result});
    } catch (error) {
      res.send({status: 'ERROR', error: error.message});
    }
  });

  app.post('/send', async (req, res) => {
    try {
      const {payload} = JSON.parse(req.body);
      if(payload) {
        const result = await writeMessage(payload);
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