import {Canvas} from 'node-canvas-webgl';
import {Divoom} from '../src/divoom/divoom.js';
import {TimeboxEvoMessage} from '../src/divoom/message.js';

global.OffscreenCanvas = Canvas;

export class DivoomNode extends Divoom {
  constructor({bluetooth, width = 16, height = 16} = {}) {
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