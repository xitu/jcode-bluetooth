import BluetoothSerialPort from 'node-bluetooth-serial-port';
import {stringToBuffer} from '../utils.js';
import {Defer} from '../../src/common/defer.js';
import {sleep} from '../../src/common/sleep.js';

export class Bluetooth {
  constructor({deviceMAC, connectionTimeout, maxConnectAttempts, connectionAttemptDelay}) {
    this._config = {deviceMAC, connectionTimeout, maxConnectAttempts, connectionAttemptDelay};
    this._dataBuffer = [];
    this.server = new BluetoothSerialPort.BluetoothSerialPort();
  }

  async connect(times = this._config.maxConnectAttempts) {
    const {connectionAttemptDelay} = this._config;
    let attempts = 0;
    let success = false;
    for(let i = 0; i < times; i += 1) {
      try {
        console.log('connection attempt %d/%d', attempts, times);
        // eslint-disable-next-line no-await-in-loop
        await this._connect();
        success = true;
        break;
      } catch (error) {
        console.error('error', error.message);
        attempts++;
        // eslint-disable-next-line no-await-in-loop
        await sleep(connectionAttemptDelay);
      }
    }
    await sleep(500); // wait for device ready
    return success ? this.server : null;
  }

  _connect() {
    const {deviceMAC, connectionTimeout} = this._config;
    const server = this.server;
    return new Promise((resolve, reject) => {
      // Find the device
      setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, connectionTimeout);

      server.findSerialPortChannel(deviceMAC, (channel) => {
        // Connect to the device
        server.connect(deviceMAC, channel, () => {
          // We connected, resolve
          resolve(server);
        }, () => reject(new Error('Cannot connect')));
      }, () => reject(new Error('Not found')));
    });
  }

  /**
   * Write a buffer to the device
   */
  write(buffer) {
    const server = this.server;
    return new Promise((resolve, reject) => {
      server.write(buffer, (error, bytes) => {
        console.log('==>', error, buffer, bytes);
        if(error) {
          server.close(); // 重新连接
          this.connect(1000).then(() => {
            console.log('reconnected!');
            this.write(buffer);
          });
        }
        return error ? reject(error) : resolve(bytes);
      });
    });
  }

  async writeMessage(command) {
    const buffers = stringToBuffer(command);
    const status = [];

    const len = this._dataBuffer.length;
    this._dataBuffer.push(...buffers);

    if(len === 0) {
      this._defer = new Defer();
      // eslint-disable-next-line no-restricted-syntax
      do {
        const buffer = this._dataBuffer.shift();
        // eslint-disable-next-line no-await-in-loop
        status.push(await this.write(buffer));
      } while(this._dataBuffer.length > 0);
      this._defer.resolve();
      this._defer = null;
    } else {
      await this._defer.promise;
    }

    return status;
  }

  async disconnect() {
    if(this._defer) await this._defer.promise;
    this.server.close();
  }
}