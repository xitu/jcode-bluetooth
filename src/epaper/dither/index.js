import {atkinson} from './algorithms/atkinson.js';
import {errorDiffusion} from './algorithms/error-diffusion.js';
import {ordered} from './algorithms/ordered.js';

export class Dither {
  static atkinson = atkinson;

  static errorDiffusion = errorDiffusion;

  static ordered = ordered;

  constructor({algorithm = Dither.atkinson, step = 1, palette = [[0, 0, 0], [255, 255, 255]]} = {}) {
    this.options = {
      algorithm,
      step,
      palette,
    };
  }

  ditherImageData(imageData, options = {}) {
    options = {...this.options, ...options};
    const ditherFn = options.algorithm;

    const output = ditherFn.call(
      this,
      imageData.data,
      options.palette,
      options.step,
      imageData.height,
      imageData.width,
    );

    imageData.data.set(output);
  }
}