import {PixooNode} from './pixoo-node.js';
import {Bluetooth} from '../server/bluetooth/bluetooth.js';

const config = {
  deviceMAC: '11:75:58:A5:B1:0A',
  maxConnectAttempts: 3,
  connectionAttemptDelay: 500,
  connectionTimeout: 10000,
};

(async function () {
  const bluetooth = new Bluetooth(config);
  await bluetooth.connect();

  const pixoo = new PixooNode({bluetooth});

  const isConnected = await pixoo.isConnected();

  console.log(isConnected, pixoo.canvas);
  const ctx = pixoo.canvas.getContext('2d');
  ctx.fillStyle = 'yellow';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = 'red';
  ctx.fillRect(8, 8, 16, 16);

  await pixoo.forceUpdate();

  await bluetooth.disconnect();

  console.log('disconnected');
}());