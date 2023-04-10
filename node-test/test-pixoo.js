import {DivoomNode} from './divoom-node.js';
import {Bluetooth} from '../server/bluetooth/bluetooth.js';

const config = {
  deviceMAC: '11:75:58:CE:DB:2F',
  maxConnectAttempts: 3,
  connectionAttemptDelay: 500,
  connectionTimeout: 10000,
};

(async function () {
  const bluetooth = new Bluetooth(config);
  await bluetooth.connect();

  const pixoo = new DivoomNode({bluetooth});

  const isConnected = await pixoo.isConnected();

  console.log(isConnected, pixoo.canvas);
  const ctx = pixoo.canvas.getContext('2d');
  ctx.fillStyle = 'yellow';
  ctx.fillRect(0, 0, 16, 16);
  ctx.fillStyle = 'red';
  ctx.fillRect(4, 4, 8, 8);

  await pixoo.forceUpdate();

  await bluetooth.disconnect();

  console.log('disconnected');
}());