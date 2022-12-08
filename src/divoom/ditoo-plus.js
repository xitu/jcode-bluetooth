import {Pixoo} from './pixoo';

class DitooPlus extends Pixoo {
  constructor({server = '//localhost:9527', width = 16, height = 16} = {}) {
    super({server, width, height});
    this.type = 'max';
  }
}

export {DitooPlus};