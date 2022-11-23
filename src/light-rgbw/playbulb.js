// https://codelabs.developers.google.com/codelabs/candle-bluetooth?hl=zh-cn&authuser=6#5

import {TinyColor} from '@ctrl/tinycolor';
import {Device} from '../device';

const COLOR_UUID = 0xfffc;
const COLOR_EFFECT_UUID = 0xfffb;

class Playbulb extends Device {
  constructor({filters = [{namePrefix: 'PLAYBULB'}],
    optionalServices = [0xff00, 0xff02, 0xff0f]} = {}) {
    super({filters, optionalServices});
  }

  async connect() {
    await super.connect();
    const service = (await this.server.getPrimaryServices())[0];
    this._lightCharacteristic = await service.getCharacteristic(COLOR_UUID);
    this._effectCharacteristic = await service.getCharacteristic(COLOR_EFFECT_UUID);
    return this;
  }

  async setColor(value) {
    const color = new TinyColor(value);
    const {r, g, b} = color.toRgb();
    const a = color.getAlpha();
    const w = (1 - a) * 0xff;
    await this._lightCharacteristic.writeValue(new Uint8Array([w, r, g, b]));
  }

  async getColor() {
    const buffer = await this._lightCharacteristic.readValue();
    const a = 1 - buffer.getUint8(0) / 255;
    return new TinyColor({r: buffer.getUint8(1), g: buffer.getUint8(2), b: buffer.getUint8(3), a});
  }

  async setFlashingColor(value) {
    const color = new TinyColor(value);
    const {r, g, b} = color.toRgb();
    const a = color.getAlpha();
    const w = (1 - a) * 0xff;
    await this._effectCharacteristic.writeValue(new Uint8Array([
      w, r, g, b,
      0x00, 0x00, 0x1F, 0x00,
    ]));
  }
}

export {Playbulb};