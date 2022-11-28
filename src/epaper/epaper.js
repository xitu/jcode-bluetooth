import {Device} from '../device';
import {EpaperCore} from './epaper-core.js';
import {int2Bytes} from './utils.js';

const READ_UUID = 0xd003;
const WRITE_UUID = 0xd002;

export class Epaper extends Device {
  constructor({filters = [{namePrefix: 'Epaper'}],
    optionalServices = [0xd0ff]} = {}) {
    super({filters, optionalServices});
    this._core = new EpaperCore();
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
    const mtu = this.MTU;
    // eslint-disable-next-line no-restricted-syntax
    for(let i = 0; i < payloads.length; i++) {
      const payload = payloads[i];
      // eslint-disable-next-line no-await-in-loop
      await this._writeCharacteristic.writeValue(payload);
      if(typeof CustomEvent === 'function') {
        const event = new CustomEvent('epaperprogress', {
          detail: {
            percent: Math.min(100, mtu * (i + 1) * 100 / EpaperCore.RAM_SIZE),
            payload,
            size: EpaperCore.RAM_SIZE,
          },
        });
        window.dispatchEvent(event);
      }
    }
  }

  async download() {
    const mtu = this.MTU;
    const header_size = 6;
    const action_read = 0x02;
    const request = new Uint8Array(header_size);
    request[0] = action_read;
    let offset = 0;
    const frameBuffer = new Uint8Array(EpaperCore.RAM_SIZE);

    // eslint-disable-next-line no-restricted-syntax
    while(offset < EpaperCore.RAM_SIZE) {
      int2Bytes(request, 1, offset, 4);
      request[5] = Math.min((mtu - header_size), (EpaperCore.RAM_SIZE - offset)) & 0xff;

      // eslint-disable-next-line no-await-in-loop
      await this._writeCharacteristic.writeValueWithResponse(request);

      // eslint-disable-next-line no-await-in-loop
      const response = await this._readCharacteristic.readValue();
      const trunk = response.buffer.slice(1);
      frameBuffer.set(trunk, offset);

      offset += mtu - header_size;

      if(typeof CustomEvent === 'function') {
        const event = new CustomEvent('epaperprogress', {
          detail: {
            percent: Math.min(100, offset * 100 / EpaperCore.RAM_SIZE),
            payload: request,
            size: EpaperCore.RAM_SIZE,
          },
        });
        window.dispatchEvent(event);
      }
    }
    return frameBuffer;
  }
}