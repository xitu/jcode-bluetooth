import {Canvas} from 'node-canvas-webgl';
import {Pixoo} from '../src/divoom/pixoo.js';
import {TimeboxEvoMessage} from '../src/divoom/timebox-evo-message.js';

global.OffscreenCanvas = Canvas;

export class PixooNode extends Pixoo {
  constructor({bluetooth, width = 32, height = 32} = {}) {
    super({width, height});
    this._bluetooth = bluetooth;
  }

  async send(message) {
    if(this._emulate) {
      // eslint-disable-next-line no-return-await
      return await Promise.resolve({status: 'OK'});
    }

    const payload = new TimeboxEvoMessage(message).message;

    // eslint-disable-next-line no-return-await
    return await this._bluetooth.writeMessage(payload);
  }
}