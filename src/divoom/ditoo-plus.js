// https://divoom.com/products/divoom-ditooplus

import {Divoom} from './divoom';

class DitooPlus extends Divoom {
  constructor({width = 16, height = 16} = {}) {
    super({width, height});
  }
}

export {DitooPlus};