// https://github.com/BluetoothRocks/Matrix/blob/master/lib/timebox.js

import {TinyColor} from '@ctrl/tinycolor';
import {Device} from '../device';
import {sleep} from '../common/sleep';

const LIGHT_SERVICE_UUID = '49535343-fe7d-4ae5-8fa9-9fafd205e455';
const LIGHT_CHARACTERISTIC_UUID = '49535343-1e4d-4bd9-ba61-23c647249616';

export class TimeboxMini extends Device {
  static MTU = 127;

  constructor({filters = [{namePrefix: 'TimeBox'}],
    optionalServices = [LIGHT_SERVICE_UUID], width = 11, height = 11} = {}) {
    super({filters, optionalServices});
    this._width = width;
    this._height = height;
    this._canvas = new OffscreenCanvas(width, height);
    this._ctx = this._canvas.getContext('2d', {willReadFrequently: true});
    this._animationFrames = [];
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get canvas() {
    return this._canvas;
  }

  async connect(rebound = true) {
    await super.connect(rebound);
    const service = await this.server.getPrimaryService(LIGHT_SERVICE_UUID);
    this._lightCharacteristic = await service.getCharacteristic(LIGHT_CHARACTERISTIC_UUID);
    await this.enterDrawingMode();
    await sleep(100);
    return this;
  }

  encodeCommand(buffer) {
    const payload = new Uint8Array(buffer.length + 4);
    const len = payload.length - 2;
    payload[0] = len & 0xff;
    payload[1] = (len >>> 8) & 0xff;
    payload.set(buffer, 2);
    const checksum = payload.reduce((a, b) => a + b, 0);
    payload[payload.length - 2] = checksum & 0xff;
    payload[payload.length - 1] = (checksum >>> 8) & 0xff;

    const extra = payload.filter(value => value === 0x01 || value === 0x02 || value === 0x03).length;
    const message = new Uint8Array(payload.length + extra + 2);

    let m = 1;

    for(let i = 0; i < payload.length; i++) {
      if(payload[i] === 0x01) {
        message[m] = 0x03;
        message[m + 1] = 0x04;
        m += 2;
      } else if(payload[i] === 0x02) {
        message[m] = 0x03;
        message[m + 1] = 0x05;
        m += 2;
      } else if(payload[i] === 0x03) {
        message[m] = 0x03;
        message[m + 1] = 0x06;
        m += 2;
      } else {
        message[m] = payload[i];
        m++;
      }
    }

    message[0] = 0x01;
    message[message.length - 1] = 0x02;
    return message;
  }

  async sendMessage(msg) {
    const command = this.encodeCommand(msg);
    // 需要分段，最大一次传送127个字节
    for(let i = 0; i < command.length; i += TimeboxMini.MTU) {
      // eslint-disable-next-line no-await-in-loop
      await this.write(this._lightCharacteristic, command.slice(i, i + TimeboxMini.MTU), {msg});
    }
  }

  async enterClockMode(color = 'white', type = 0) {
    const {r, g, b} = new TinyColor(color).toRgb();

    const msg = new Uint8Array([
      0x45, // Change box mode
      0x00, // to clock
      type, // type: 0 = 12, 1 = 24
      r, g, b, // color
    ]);

    await this.sendMessage(msg);
  }

  async enterDrawingMode() {
    const msg = new Uint8Array([
      0x44, // Enter drawing mode
      0x00,
      0x0a,
      0x0a,
      0x04,
    ]);

    await this.sendMessage(msg);
  }

  async enterTempMode(color = 'white', type = 0) {
    const {r, g, b} = new TinyColor(color).toRgb();

    const msg = new Uint8Array([
      0x45, // Change box mode
      0x01, // to temperature
      type, // type: 0 = C, 1 = F
      r, g, b, // color
    ]);

    await this.sendMessage(msg);
  }

  async enterLightMode(color = 'white', intensity = 0x64, mode = 0) {
    const {r, g, b} = new TinyColor(color).toRgb();

    const msg = new Uint8Array([
      0x45, // Change box mode
      0x02, // to light
      r, g, b, // color
      intensity, // intensity: 0x00 - 0x64
      mode, // mode: 0x00 - 0x01
    ]);

    await this.sendMessage(msg);
  }

  async enterAnimationMode(preset = 0) {
    const msg = new Uint8Array([
      0x45, // Change box mode
      0x03, // to animation
      preset,
    ]);

    await this.sendMessage(msg);
  }

  async setSoundMode(topColor = 'red', activeColor = 'white', preset = 0) {
    const {r: r1, g: g1, b: b1} = new TinyColor(topColor).toRgb();
    const {r: r2, g: g2, b: b2} = new TinyColor(activeColor).toRgb();

    const msg = new Uint8Array([
      0x45, // Change box mode
      0x04, // to sound based animation
      preset,
      r1, g1, b1, // top color
      r2, g2, b2, // active color
    ]);

    await this.sendMessage(msg);
  }

  async enterImageMode() {
    const msg = new Uint8Array([
      0x45, // Change box mode
      0x05, // to user image
    ]);

    await this.sendMessage(msg);
  }

  setPixel(color, x, y) {
    return this.setPixels(color, [[x, y]]);
  }

  async setPixels(color, positions) {
    const {r, g, b} = new TinyColor(color).toRgb();
    const p = positions.map(([x, y]) => y * this._width + x);

    const msg = new Uint8Array([
      0x58, // Drawing pad control
      r, g, b, // color
      p.length, // number of positions = 1
      ...p, // single position: 0 to (11 x 11) - 1
    ]);

    await this.sendMessage(msg);
  }

  encodeImage(image = this._canvas) {
    if(image !== this._canvas) {
      this._ctx.drawImage(image, 0, 0, this._width, this._height);
    }
    const data = this._ctx.getImageData(0, 0, this._width, this._height).data;

    const pixels = new Uint8Array(data.length / 4 * 3);
    for(let i = 0; i < data.length; i += 4) {
      pixels[i / 4 * 3] = data[i];
      pixels[i / 4 * 3 + 1] = data[i + 1];
      pixels[i / 4 * 3 + 2] = data[i + 2];
    }

    const buffer = new Uint8Array(Math.ceil(pixels.length / 2));

    for(let b = 0, i = 0; i < pixels.length; b++, i += 2) {
      if(i === pixels.length - 1) {
        buffer[b] = (pixels[i] >> 4);
      } else {
        buffer[b] = (pixels[i] >> 4) | ((pixels[i + 1] >> 4) << 4);
      }
    }

    return buffer;
  }

  async setImage(image) {
    // await this.enterImageMode();
    const buffer = this.encodeImage(image);
    const payload = new Uint8Array(buffer.length + 5);
    payload.set([0x44, 0x00, 0x0a, 0x0a, 0x04, ...buffer]);
    await this.sendMessage(payload);
  }

  clearAnimationFrames() {
    this._animationFrames.length = 0;
  }

  appendAnimationFrame(image, duration = 1) {
    const buffer = this.encodeImage(image);
    this._animationFrames.push({buffer, duration});
  }

  async playAnimation() {
    for(let i = 0; i < this._animationFrames.length; i++) {
      const {buffer, duration} = this._animationFrames[i];
      const payload = new Uint8Array(buffer.length + 8);
      payload.set([0x49, 0x00, 0x0a, 0x0a, 0x04, i, duration, ...buffer]);
      // eslint-disable-next-line no-await-in-loop
      await this.sendMessage(payload);
    }
  }
}