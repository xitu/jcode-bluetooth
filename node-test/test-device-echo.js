import {Bluetooth} from '../server/bluetooth/bluetooth.js';
import {TimeboxEvoMessage} from '../src/divoom/message.js';

const config = {
  deviceMAC: '11:75:58:CE:DB:2F',
  maxConnectAttempts: 3,
  connectionAttemptDelay: 500,
  connectionTimeout: 10000,
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomColor() {
  const R = Math.floor(Math.random() * 255);
  const G = Math.floor(Math.random() * 255);
  const B = Math.floor(Math.random() * 255);
  return `${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
}

(async function () {
  const bluetooth = new Bluetooth(config);
  const connection = await bluetooth.connect();
  console.log('connected');

  connection.on('data', (buffer) => {
    const result = buffer.toString('hex');
    console.log('<==', result);
  });

  process.on('SIGINT', async () => {
    await bluetooth.disconnect();
    console.log('disconnected');
    process.exit(0);
  });

  while(1) {
    const color = randomColor();
    const message = `4501${color}500001000000`;
    console.log('message:', message);
    const payload = new TimeboxEvoMessage(message).message;
    console.log('payload', payload, payload.length);
    // eslint-disable-next-line no-await-in-loop
    await bluetooth.writeMessage(payload);
    // eslint-disable-next-line no-await-in-loop
    await sleep(1000);
  }
}());
