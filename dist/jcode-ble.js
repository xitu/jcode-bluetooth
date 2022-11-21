var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/color-name/index.js"(exports, module) {
    "use strict";
    module.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// src/device.js
var Device = class {
  constructor({ filters = [], optionalServices = [] } = {}) {
    this.filters = filters;
    this.optionalServices = optionalServices;
    this._server = null;
  }
  async connect() {
    const { filters, optionalServices } = this;
    const acceptAllDevices = filters.length <= 0;
    const options = {};
    if (acceptAllDevices)
      options.acceptAllDevices = true;
    else {
      options.filters = filters;
      options.optionalServices = optionalServices;
    }
    const device = await navigator.bluetooth.requestDevice(options);
    device.addEventListener("gattserverdisconnected", () => {
      const e2 = new CustomEvent("devicedisconnected", { detail: { device: this } });
      window.dispatchEvent(e2);
    });
    this._server = await device.gatt.connect();
    const e = new CustomEvent("deviceconnected", { detail: { device: this } });
    window.dispatchEvent(e);
    return this;
  }
  async disconnect() {
    await this.server.device.gatt.disconnect();
  }
  get server() {
    if (this._server === null) {
      throw new ReferenceError("server is not connected");
    }
    return this._server;
  }
};

// node_modules/color-parse/index.mjs
var import_color_name = __toESM(require_color_name(), 1);
var color_parse_default = parse;
var baseHues = {
  red: 0,
  orange: 60,
  yellow: 120,
  green: 180,
  blue: 240,
  purple: 300
};
function parse(cstr) {
  var m, parts = [], alpha = 1, space;
  if (typeof cstr === "string") {
    if (import_color_name.default[cstr]) {
      parts = import_color_name.default[cstr].slice();
      space = "rgb";
    } else if (cstr === "transparent") {
      alpha = 0;
      space = "rgb";
      parts = [0, 0, 0];
    } else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
      var base = cstr.slice(1);
      var size = base.length;
      var isShort = size <= 4;
      alpha = 1;
      if (isShort) {
        parts = [
          parseInt(base[0] + base[0], 16),
          parseInt(base[1] + base[1], 16),
          parseInt(base[2] + base[2], 16)
        ];
        if (size === 4) {
          alpha = parseInt(base[3] + base[3], 16) / 255;
        }
      } else {
        parts = [
          parseInt(base[0] + base[1], 16),
          parseInt(base[2] + base[3], 16),
          parseInt(base[4] + base[5], 16)
        ];
        if (size === 8) {
          alpha = parseInt(base[6] + base[7], 16) / 255;
        }
      }
      if (!parts[0])
        parts[0] = 0;
      if (!parts[1])
        parts[1] = 0;
      if (!parts[2])
        parts[2] = 0;
      space = "rgb";
    } else if (m = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
      var name = m[1];
      var isRGB = name === "rgb";
      var base = name.replace(/a$/, "");
      space = base;
      var size = base === "cmyk" ? 4 : base === "gray" ? 1 : 3;
      parts = m[2].trim().split(/\s*[,\/]\s*|\s+/).map(function(x, i) {
        if (/%$/.test(x)) {
          if (i === size)
            return parseFloat(x) / 100;
          if (base === "rgb")
            return parseFloat(x) * 255 / 100;
          return parseFloat(x);
        } else if (base[i] === "h") {
          if (/deg$/.test(x)) {
            return parseFloat(x);
          } else if (baseHues[x] !== void 0) {
            return baseHues[x];
          }
        }
        return parseFloat(x);
      });
      if (name === base)
        parts.push(1);
      alpha = isRGB ? 1 : parts[size] === void 0 ? 1 : parts[size];
      parts = parts.slice(0, size);
    } else if (cstr.length > 10 && /[0-9](?:\s|\/)/.test(cstr)) {
      parts = cstr.match(/([0-9]+)/g).map(function(value) {
        return parseFloat(value);
      });
      space = cstr.match(/([a-z])/ig).join("").toLowerCase();
    }
  } else if (!isNaN(cstr)) {
    space = "rgb";
    parts = [cstr >>> 16, (cstr & 65280) >>> 8, cstr & 255];
  } else if (Array.isArray(cstr) || cstr.length) {
    parts = [cstr[0], cstr[1], cstr[2]];
    space = "rgb";
    alpha = cstr.length === 4 ? cstr[3] : 1;
  } else if (cstr instanceof Object) {
    if (cstr.r != null || cstr.red != null || cstr.R != null) {
      space = "rgb";
      parts = [
        cstr.r || cstr.red || cstr.R || 0,
        cstr.g || cstr.green || cstr.G || 0,
        cstr.b || cstr.blue || cstr.B || 0
      ];
    } else {
      space = "hsl";
      parts = [
        cstr.h || cstr.hue || cstr.H || 0,
        cstr.s || cstr.saturation || cstr.S || 0,
        cstr.l || cstr.lightness || cstr.L || cstr.b || cstr.brightness
      ];
    }
    alpha = cstr.a || cstr.alpha || cstr.opacity || 1;
    if (cstr.opacity != null)
      alpha /= 100;
  }
  return {
    space,
    values: parts,
    alpha
  };
}

// node_modules/color-space/rgb.js
var rgb_default = {
  name: "rgb",
  min: [0, 0, 0],
  max: [255, 255, 255],
  channel: ["red", "green", "blue"],
  alias: ["RGB"]
};

// node_modules/color-space/hsl.js
var hsl_default = {
  name: "hsl",
  min: [0, 0, 0],
  max: [360, 100, 100],
  channel: ["hue", "saturation", "lightness"],
  alias: ["HSL"],
  rgb: function(hsl) {
    var h = hsl[0] / 360, s = hsl[1] / 100, l = hsl[2] / 100, t1, t2, t3, rgb, val;
    if (s === 0) {
      val = l * 255;
      return [val, val, val];
    }
    if (l < 0.5) {
      t2 = l * (1 + s);
    } else {
      t2 = l + s - l * s;
    }
    t1 = 2 * l - t2;
    rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
      t3 = h + 1 / 3 * -(i - 1);
      if (t3 < 0) {
        t3++;
      } else if (t3 > 1) {
        t3--;
      }
      if (6 * t3 < 1) {
        val = t1 + (t2 - t1) * 6 * t3;
      } else if (2 * t3 < 1) {
        val = t2;
      } else if (3 * t3 < 2) {
        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
      } else {
        val = t1;
      }
      rgb[i] = val * 255;
    }
    return rgb;
  }
};
rgb_default.hsl = function(rgb) {
  var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min, h, s, l;
  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }
  h = Math.min(h * 60, 360);
  if (h < 0) {
    h += 360;
  }
  l = (min + max) / 2;
  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }
  return [h, s * 100, l * 100];
};

// node_modules/color-rgba/index.mjs
function rgba(color) {
  if (Array.isArray(color) && color.raw)
    color = String.raw(...arguments);
  var values, i, l;
  var parsed = color_parse_default(color);
  if (!parsed.space)
    return [];
  const min = parsed.space[0] === "h" ? hsl_default.min : rgb_default.min;
  const max = parsed.space[0] === "h" ? hsl_default.max : rgb_default.max;
  values = Array(3);
  values[0] = Math.min(Math.max(parsed.values[0], min[0]), max[0]);
  values[1] = Math.min(Math.max(parsed.values[1], min[1]), max[1]);
  values[2] = Math.min(Math.max(parsed.values[2], min[2]), max[2]);
  if (parsed.space[0] === "h") {
    values = hsl_default.rgb(values);
  }
  values.push(Math.min(Math.max(parsed.alpha, 0), 1));
  return values;
}

// src/light-rgbw/playbulb.js
var COLOR_UUID = 65532;
var COLOR_EFFECT_UUID = 65531;
var Playbulb = class extends Device {
  constructor({
    filters = [{ namePrefix: "PLAYBULB" }],
    optionalServices = [65280, 65282, 65295]
  } = {}) {
    super({ filters, optionalServices });
  }
  async connect() {
    await super.connect();
    const service = (await this.server.getPrimaryServices())[0];
    this._lightCharacteristic = await service.getCharacteristic(COLOR_UUID);
    this._effectCharacteristic = await service.getCharacteristic(COLOR_EFFECT_UUID);
    return this;
  }
  async setColor(value) {
    const [r, g, b, a] = rgba(value);
    const w = (1 - a) * 255;
    await this._lightCharacteristic.writeValue(new Uint8Array([w, r, g, b]));
  }
  async getColor() {
    const buffer = await this._lightCharacteristic.readValue();
    const a = 1 - buffer.getUint8(0) / 255;
    return rgba({ r: buffer.getUint8(1), g: buffer.getUint8(2), b: buffer.getUint8(3), a });
  }
  async setFlashingColor(value) {
    const [r, g, b, a] = rgba(value);
    const w = (1 - a) * 255;
    await this._effectCharacteristic.writeValue(new Uint8Array([
      w,
      r,
      g,
      b,
      0,
      0,
      31,
      0
    ]));
  }
};
export {
  Device,
  Playbulb
};
