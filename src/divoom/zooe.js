// https://divoom.com/products/zooe

import {Divoom} from './divoom';

class Zooe extends Divoom {
  constructor({width = 16, height = 16} = {}) {
    super({width, height});
  }
}

export {Zooe};