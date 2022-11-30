import BluetoothSerialPort from 'node-bluetooth-serial-port';
import {stringToBuffer} from '../utils.js';
import {Defer} from '../../src/common/defer.js';
import {sleep} from '../../src/common/sleep.js';

export class Bluetooth {
  constructor({deviceMAC, connectionTimeout, maxConnectAttempts, connectionAttemptDelay}) {
    this._connection = null;
    this._tempBuffer = null;
    this._config = {deviceMAC, connectionTimeout, maxConnectAttempts, connectionAttemptDelay};
    this._dataBuffer = [];
    this.SPP_Port = new BluetoothSerialPort.BluetoothSerialPort();
  }

  get connection() {
    return this._connection;
  }

  async connect(times = this._config.maxConnectAttempts) {
    const {connectionAttemptDelay} = this._config;
    let attempts = 0;
    for(let i = 0; i < times; i += 1) {
      try {
        console.log('connection attempt %d/%d', attempts, times);
        // eslint-disable-next-line no-await-in-loop
        this._connection = await this._connect();
        break;
      } catch (error) {
        console.error('error', error.message);
        attempts++;
        // eslint-disable-next-line no-await-in-loop
        await sleep(connectionAttemptDelay);
      }
    }
    return this._connection;
  }

  _connect() {
    const {deviceMAC, connectionTimeout} = this._config;
    const SPP_Port = this.SPP_Port;
    return new Promise((resolve, reject) => {
      // Find the device
      setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, connectionTimeout);

      SPP_Port.findSerialPortChannel(deviceMAC, (channel) => {
        // Connect to the device
        SPP_Port.connect(deviceMAC, channel, () => {
          // We connected, resolve
          resolve(SPP_Port);
        }, () => reject(new Error('Cannot connect')));
      }, () => reject(new Error('Not found')));
    });
  }

  /**
   * Write a buffer to the device
   */
  write(buffer) {
    const connection = this._connection;
    return new Promise((resolve, reject) => {
      if(!connection) {
        this._tempBuffer = buffer;
        return reject(new Error('Not connected'));
      }
      connection.write(buffer, (error, bytes) => {
        console.log('==>', error, buffer, bytes);
        if(error) {
          connection.close(); // 重新连接
          this._connection = null;
          this.tryConnect(1000).then((conn) => {
            console.log('reconnected!');
            this._connection = conn;
            if(this._tempBuffer) {
              return conn.write(this._tempBuffer, () => {
                this._tempBuffer = null;
              });
            }
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
    if(this.connection) await this.connection.close();
  }
}