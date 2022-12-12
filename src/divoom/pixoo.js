import {Divoom} from './divoom';

class Pixoo extends Divoom {
  constructor({width = 16, height = 16} = {}) {
    super({width, height});
  }
}

export {Pixoo};