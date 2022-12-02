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

  async connect(rebound = true) {
    await super.connect(rebound);
    const service = (await this.server.getPrimaryServices())[0];
    this._lightCharacteristic = await service.getCharacteristic(COLOR_UUID);
    this._effectCharacteristic = await service.getCharacteristic(COLOR_EFFECT_UUID);
    return this;
  }

  async setBrightness(value) {
    const color = await this.getColor();
    const a = 1 - value / 0xff;
    color.setAlpha(a);
    await this.setColor(color);
  }

  async getBrightness() {
    const color = await this.getColor();
    return Math.round((1 - color.getAlpha()) * 0xff);
  }

  async setColor(value) {
    const color = new TinyColor(value);
    const {r, g, b} = color.toRgb();
    const a = color.getAlpha();
    const w = Math.round((1 - a) * 0xff);
    await this.write(this._lightCharacteristic, new Uint8Array([w, r, g, b]), color);
  }

  async getColor() {
    const buffer = await this._lightCharacteristic.readValue();
    const a = 1 - buffer.getUint8(0) / 255;
    return new TinyColor({r: buffer.getUint8(1), g: buffer.getUint8(2), b: buffer.getUint8(3), a});
  }

  async setColorEffect(value, effect = 0x00, speed = 0x1f) {
    let color;

    if(!value) color = await this.getColor();
    else color = new TinyColor(value);

    const {r, g, b} = color.toRgb();
    const a = color.getAlpha();
    const w = (1 - a) * 0xff;
    await this.write(this._effectCharacteristic, new Uint8Array([
      w, r, g, b,
      effect, 0x00, speed, 0x00,
    ]), {color, effect, speed});
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