import {Pixoo} from './pixoo';

class DitooPlus extends Pixoo {
  constructor({width = 16, height = 16} = {}) {
    super({width, height});
    this.type = 'max';
  }
}

export {DitooPlus};