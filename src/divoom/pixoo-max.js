import {Pixoo} from './pixoo';

class PixooMax extends Pixoo {
  constructor(server = '//localhost:9527', width = 32, height = 32) {
    super(server, width, height);
    this.type = 'max';
  }
}

export {PixooMax};