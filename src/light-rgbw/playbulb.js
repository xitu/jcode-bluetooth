// https://codelabs.developers.google.com/codelabs/candle-bluetooth?hl=zh-cn&authuser=6#5
// https://github.com/Phhere/Playbulb

import {TinyColor} from '@ctrl/tinycolor';
import {Device} from '../device';

const COLOR_UUID = 0xfffc;
const COLOR_EFFECT_UUID = 0xfffb;

class Playbulb extends Device {
  static FLASH = 0x00;

  static PULSE = 0x01;

  static RAINBOW_JUMP = 0x02;

  static RAINBOW_JFADE = 0x03;

  static CANDLE = 0x04;

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
    try {
      const color = new TinyColor(value);
      const {r, g, b} = color.toRgb();
      const a = color.getAlpha();
      const w = (1 - a) * 0xff;
      await this._lightCharacteristic.writeValue(new Uint8Array([w, r, g, b]));
    } catch (ex) {
      await this.connect();
      this.setColor(value);
    }
  }

  async getColor() {
    try {
      const buffer = await this._lightCharacteristic.readValue();
      const a = 1 - buffer.getUint8(0) / 255;
      return new TinyColor({r: buffer.getUint8(1), g: buffer.getUint8(2), b: buffer.getUint8(3), a});
    } catch (ex) {
      await this.connect();
      return this.getColor();
    }
  }

  async setColorEffect(value, effect = 0x00, speed = 0x1f) {
    try {
      const color = new TinyColor(value);
      const {r, g, b} = color.toRgb();
      const a = color.getAlpha();
      const w = (1 - a) * 0xff;
      await this._effectCharacteristic.writeValue(new Uint8Array([
        w, r, g, b,
        effect, 0x00, speed, 0x00,
      ]));
    } catch (ex) {
      await this.connect();
      this.setCandleEffectColor(value);
    }
  }

  async setFlashingColor(value, speed = 0x1f) {
    await this.setColorEffect(value, Playbulb.FLASH, speed);
  }

  async setCandlingColor(value, speed = 0x10) {
    await this.setColorEffect(value, Playbulb.CANDLE, speed);
  }

  async setPulsingColor(value, speed = 0x03) {
    await this.setColorEffect(value, Playbulb.PULSE, speed);
  }

  async setRainbowJumpingColor(value, speed = 0xff) {
    await this.setColorEffect(value, Playbulb.RAINBOW_JUMP, speed);
  }

  async setRainbowFadingColor(value, speed = 0x1f) {
    await this.setColorEffect(value, Playbulb.RAINBOW_JFADE, speed);
  }
}

export {Playbulb};