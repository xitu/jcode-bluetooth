import {PixelData} from '../common/pixel-data.js';
// pixel data
export class Matrix extends PixelData {
  constructor(width = 32, height = 32) {
    super(width, height);
  }
}