import {Pixoo} from './pixoo';

class PixooMax extends Pixoo {
  constructor({width = 32, height = 32} = {}) {
    super({width, height});
    this.type = 'max';
  }
}

export {PixooMax};