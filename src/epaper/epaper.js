import {Device} from '../device';
import {EpaperCore} from './epaper-core.js';
import {int2Bytes} from './utils.js';
import {Defer} from '../common/defer';

const READ_UUID = 0xd003;
const WRITE_UUID = 0xd002;

export class Epaper extends Device {
  static MTU = 127;

  constructor({filters = [{namePrefix: 'Epaper'}, {namePrefix: 'EPD'}],
    optionalServices = [0xd0ff]} = {}) {
    super({filters, optionalServices});
    this._core = new EpaperCore({mtu: Epaper.MTU});
  }

  get width() {
    return this._core.width;
  }

  get height() {
    return this._core.height;
  }

  get canvas() {
    return this._core._paintCanvas;
  }

  async connect(rebound = true) {
    await super.connect(rebound);
    const service = (await this.server.getPrimaryServices())[0];
    this._readCharacteristic = await service.getCharacteristic(READ_UUID);
    this._writeCharacteristic = await service.getCharacteristic(WRITE_UUID);
    return this;
  }

  async flush() {
    // eslint-disable-next-line no-return-await
    return await this._writeCharacteristic.writeValue(new Uint8Array([0x01]));
  }

  async upload() {
    const payloads = this._core.generateUploadPlayloads();
    const mtu = Epaper.MTU;
    const header_size = 6;
    let offset = 0;
    // eslint-disable-next-line no-restricted-syntax
    for(let i = 0; i < payloads.length; i++) {
      const payload = payloads[i];
      // eslint-disable-next-line no-await-in-loop
      await this._writeCharacteristic.writeValue(payload);
      offset += mtu - header_size;
      if(typeof CustomEvent === 'function') {
        const event = new CustomEvent('epaperprogress', {
          detail: {
            type: 'upload',
            percent: Math.min(100, offset * 100 / EpaperCore.RAM_SIZE),
            payload,
            size: EpaperCore.RAM_SIZE,
          },
        });
        window.dispatchEvent(event);
      }
    }
  }

  fromImage(image, {x = 0, y = 0, width = this.width, height = this.height, dither = 'atkinson', step = 1, paletteType = 0} = {}) {
    return this._core.fromImage({image, x, y, width, height, dither, step, paletteType});
  }

  async download() {
    const mtu = Epaper.MTU;
    const header_size = 6;
    const action_read = 0x02;
    const request = new Uint8Array(header_size);
    request[0] = action_read;
    let offset = 0;
    const frameBuffer = new Uint8Array(EpaperCore.RAM_SIZE);
    let notificationDefer = null;

    const notificationHandler = (event) => {
      const data = new Uint8Array(event.target.value.buffer);
      // console.log(data);
      if(data[0] === 0x2 && data[1] === 0x0 && data.length === mtu - header_size + 2) { // 读取数据
        // 成功读取数据
        notificationDefer.resolve({buffer: data.slice(2)});
      } else if(data[0] === 0x2 && data[1] === 0x1) {
        notificationDefer.reject(new Error('Read data failed.'));
      }
    };

    await this._readCharacteristic.startNotifications();
    this._readCharacteristic.addEventListener('characteristicvaluechanged', notificationHandler);

    // eslint-disable-next-line no-restricted-syntax
    while(offset < EpaperCore.RAM_SIZE) {
      int2Bytes(request, 1, offset, 4);
      request[5] = Math.min((mtu - header_size), (EpaperCore.RAM_SIZE - offset)) & 0xff;

      notificationDefer = new Defer();

      // eslint-disable-next-line no-await-in-loop
      await this._writeCharacteristic.writeValueWithResponse(request);

      // eslint-disable-next-line no-await-in-loop
      const response = await notificationDefer.promise;
      const trunk = response.buffer;
      frameBuffer.set(trunk, offset);

      offset += mtu - header_size;

      if(typeof CustomEvent === 'function') {
        const event = new CustomEvent('epaperprogress', {
          detail: {
            type: 'download',
            percent: Math.min(100, offset * 100 / EpaperCore.RAM_SIZE),
            payload: request,
            trunk,
            size: EpaperCore.RAM_SIZE,
          },
        });
        window.dispatchEvent(event);
      }
    }
    await this._readCharacteristic.stopNotifications();
    this._readCharacteristic.removeEventListener('characteristicvaluechanged',
      notificationHandler);

    return frameBuffer;
  }
}