import {Divoom} from './divoom';

class PixooMax extends Divoom {
  constructor({width = 32, height = 32} = {}) {
    super({width, height});
    this.type = 'max';
  }
}

export {PixooMax};