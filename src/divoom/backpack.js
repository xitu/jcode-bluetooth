// https://divoom.com/products/divoom-backpack

import {Divoom} from './divoom';

class Backpack extends Divoom {
  constructor({width = 16, height = 16} = {}) {
    super({width, height});
  }
}

export {Backpack};