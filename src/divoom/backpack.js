// https://divoom.com/products/divoom-backpack

import {Pixoo} from './pixoo';

class Backpack extends Pixoo {
  constructor({width = 16, height = 16} = {}) {
    super({width, height});
  }
}

export {Backpack};