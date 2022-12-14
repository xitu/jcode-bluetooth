var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/@ctrl/tinycolor/dist/module/util.js
function bound01(n, max) {
  if (isOnePointZero(n)) {
    n = "100%";
  }
  var isPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }
  if (Math.abs(n - max) < 1e-6) {
    return 1;
  }
  if (max === 360) {
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    n = n % max / parseFloat(String(max));
  }
  return n;
}
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
function isOnePointZero(n) {
  return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
}
function isPercentage(n) {
  return typeof n === "string" && n.indexOf("%") !== -1;
}
function boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}
function convertToPercentage(n) {
  if (n <= 1) {
    return "".concat(Number(n) * 100, "%");
  }
  return n;
}
function pad2(c) {
  return c.length === 1 ? "0" + c : String(c);
}

// node_modules/@ctrl/tinycolor/dist/module/conversion.js
function rgbToRgb(r, g, b) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255
  };
}
function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var s = 0;
  var l = (max + min) / 2;
  if (max === min) {
    s = 0;
    h = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}
function hue2rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * (6 * t);
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}
function hslToRgb(h, s, l) {
  var r;
  var g;
  var b;
  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);
  if (s === 0) {
    g = l;
    b = l;
    r = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}
function rgbToHsv(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var v = max;
  var d = max - min;
  var s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return { h, s, v };
}
function hsvToRgb(h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);
  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];
  return { r: r * 255, g: g * 255, b: b * 255 };
}
function rgbToHex(r, g, b, allow3Char) {
  var hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16))
  ];
  if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join("");
}
function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
    pad2(convertDecimalToHex(a))
  ];
  if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join("");
}
function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 65280) >> 8,
    b: color & 255
  };
}

// node_modules/@ctrl/tinycolor/dist/module/css-color-names.js
var names = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};

// node_modules/@ctrl/tinycolor/dist/module/format-input.js
function inputToRGB(color) {
  var rgb = { r: 0, g: 0, b: 0 };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color === "string") {
    color = stringInputToObject(color);
  }
  if (typeof color === "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = "hsl";
    }
    if (Object.prototype.hasOwnProperty.call(color, "a")) {
      a = color.a;
    }
  }
  a = boundAlpha(a);
  return {
    ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a
  };
}
var CSS_INTEGER = "[-\\+]?\\d+%?";
var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var matchers = {
  CSS_UNIT: new RegExp(CSS_UNIT),
  rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
  rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
  hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
  hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
  hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
  hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function stringInputToObject(color) {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  }
  var match = matchers.rgb.exec(color);
  if (match) {
    return { r: match[1], g: match[2], b: match[3] };
  }
  match = matchers.rgba.exec(color);
  if (match) {
    return { r: match[1], g: match[2], b: match[3], a: match[4] };
  }
  match = matchers.hsl.exec(color);
  if (match) {
    return { h: match[1], s: match[2], l: match[3] };
  }
  match = matchers.hsla.exec(color);
  if (match) {
    return { h: match[1], s: match[2], l: match[3], a: match[4] };
  }
  match = matchers.hsv.exec(color);
  if (match) {
    return { h: match[1], s: match[2], v: match[3] };
  }
  match = matchers.hsva.exec(color);
  if (match) {
    return { h: match[1], s: match[2], v: match[3], a: match[4] };
  }
  match = matchers.hex8.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  match = matchers.hex4.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function isValidCSSUnit(color) {
  return Boolean(matchers.CSS_UNIT.exec(String(color)));
}

// node_modules/@ctrl/tinycolor/dist/module/index.js
var TinyColor = function() {
  function TinyColor2(color, opts) {
    if (color === void 0) {
      color = "";
    }
    if (opts === void 0) {
      opts = {};
    }
    var _a;
    if (color instanceof TinyColor2) {
      return color;
    }
    if (typeof color === "number") {
      color = numberInputToObject(color);
    }
    this.originalInput = color;
    var rgb = inputToRGB(color);
    this.originalInput = color;
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    this.a = rgb.a;
    this.roundA = Math.round(100 * this.a) / 100;
    this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
    this.gradientType = opts.gradientType;
    if (this.r < 1) {
      this.r = Math.round(this.r);
    }
    if (this.g < 1) {
      this.g = Math.round(this.g);
    }
    if (this.b < 1) {
      this.b = Math.round(this.b);
    }
    this.isValid = rgb.ok;
  }
  TinyColor2.prototype.isDark = function() {
    return this.getBrightness() < 128;
  };
  TinyColor2.prototype.isLight = function() {
    return !this.isDark();
  };
  TinyColor2.prototype.getBrightness = function() {
    var rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
  };
  TinyColor2.prototype.getLuminance = function() {
    var rgb = this.toRgb();
    var R;
    var G;
    var B;
    var RsRGB = rgb.r / 255;
    var GsRGB = rgb.g / 255;
    var BsRGB = rgb.b / 255;
    if (RsRGB <= 0.03928) {
      R = RsRGB / 12.92;
    } else {
      R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    }
    if (GsRGB <= 0.03928) {
      G = GsRGB / 12.92;
    } else {
      G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    }
    if (BsRGB <= 0.03928) {
      B = BsRGB / 12.92;
    } else {
      B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  TinyColor2.prototype.getAlpha = function() {
    return this.a;
  };
  TinyColor2.prototype.setAlpha = function(alpha) {
    this.a = boundAlpha(alpha);
    this.roundA = Math.round(100 * this.a) / 100;
    return this;
  };
  TinyColor2.prototype.toHsv = function() {
    var hsv = rgbToHsv(this.r, this.g, this.b);
    return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
  };
  TinyColor2.prototype.toHsvString = function() {
    var hsv = rgbToHsv(this.r, this.g, this.b);
    var h = Math.round(hsv.h * 360);
    var s = Math.round(hsv.s * 100);
    var v = Math.round(hsv.v * 100);
    return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
  };
  TinyColor2.prototype.toHsl = function() {
    var hsl = rgbToHsl(this.r, this.g, this.b);
    return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
  };
  TinyColor2.prototype.toHslString = function() {
    var hsl = rgbToHsl(this.r, this.g, this.b);
    var h = Math.round(hsl.h * 360);
    var s = Math.round(hsl.s * 100);
    var l = Math.round(hsl.l * 100);
    return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
  };
  TinyColor2.prototype.toHex = function(allow3Char) {
    if (allow3Char === void 0) {
      allow3Char = false;
    }
    return rgbToHex(this.r, this.g, this.b, allow3Char);
  };
  TinyColor2.prototype.toHexString = function(allow3Char) {
    if (allow3Char === void 0) {
      allow3Char = false;
    }
    return "#" + this.toHex(allow3Char);
  };
  TinyColor2.prototype.toHex8 = function(allow4Char) {
    if (allow4Char === void 0) {
      allow4Char = false;
    }
    return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
  };
  TinyColor2.prototype.toHex8String = function(allow4Char) {
    if (allow4Char === void 0) {
      allow4Char = false;
    }
    return "#" + this.toHex8(allow4Char);
  };
  TinyColor2.prototype.toRgb = function() {
    return {
      r: Math.round(this.r),
      g: Math.round(this.g),
      b: Math.round(this.b),
      a: this.a
    };
  };
  TinyColor2.prototype.toRgbString = function() {
    var r = Math.round(this.r);
    var g = Math.round(this.g);
    var b = Math.round(this.b);
    return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
  };
  TinyColor2.prototype.toPercentageRgb = function() {
    var fmt = function(x) {
      return "".concat(Math.round(bound01(x, 255) * 100), "%");
    };
    return {
      r: fmt(this.r),
      g: fmt(this.g),
      b: fmt(this.b),
      a: this.a
    };
  };
  TinyColor2.prototype.toPercentageRgbString = function() {
    var rnd = function(x) {
      return Math.round(bound01(x, 255) * 100);
    };
    return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
  };
  TinyColor2.prototype.toName = function() {
    if (this.a === 0) {
      return "transparent";
    }
    if (this.a < 1) {
      return false;
    }
    var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
    for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
      var _b = _a[_i], key = _b[0], value = _b[1];
      if (hex === value) {
        return key;
      }
    }
    return false;
  };
  TinyColor2.prototype.toString = function(format) {
    var formatSet = Boolean(format);
    format = format !== null && format !== void 0 ? format : this.format;
    var formattedString = false;
    var hasAlpha = this.a < 1 && this.a >= 0;
    var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
    if (needsAlphaFormat) {
      if (format === "name" && this.a === 0) {
        return this.toName();
      }
      return this.toRgbString();
    }
    if (format === "rgb") {
      formattedString = this.toRgbString();
    }
    if (format === "prgb") {
      formattedString = this.toPercentageRgbString();
    }
    if (format === "hex" || format === "hex6") {
      formattedString = this.toHexString();
    }
    if (format === "hex3") {
      formattedString = this.toHexString(true);
    }
    if (format === "hex4") {
      formattedString = this.toHex8String(true);
    }
    if (format === "hex8") {
      formattedString = this.toHex8String();
    }
    if (format === "name") {
      formattedString = this.toName();
    }
    if (format === "hsl") {
      formattedString = this.toHslString();
    }
    if (format === "hsv") {
      formattedString = this.toHsvString();
    }
    return formattedString || this.toHexString();
  };
  TinyColor2.prototype.toNumber = function() {
    return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
  };
  TinyColor2.prototype.clone = function() {
    return new TinyColor2(this.toString());
  };
  TinyColor2.prototype.lighten = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.brighten = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var rgb = this.toRgb();
    rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
    rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
    rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
    return new TinyColor2(rgb);
  };
  TinyColor2.prototype.darken = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.tint = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    return this.mix("white", amount);
  };
  TinyColor2.prototype.shade = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    return this.mix("black", amount);
  };
  TinyColor2.prototype.desaturate = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.saturate = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.greyscale = function() {
    return this.desaturate(100);
  };
  TinyColor2.prototype.spin = function(amount) {
    var hsl = this.toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.mix = function(color, amount) {
    if (amount === void 0) {
      amount = 50;
    }
    var rgb1 = this.toRgb();
    var rgb2 = new TinyColor2(color).toRgb();
    var p = amount / 100;
    var rgba = {
      r: (rgb2.r - rgb1.r) * p + rgb1.r,
      g: (rgb2.g - rgb1.g) * p + rgb1.g,
      b: (rgb2.b - rgb1.b) * p + rgb1.b,
      a: (rgb2.a - rgb1.a) * p + rgb1.a
    };
    return new TinyColor2(rgba);
  };
  TinyColor2.prototype.analogous = function(results, slices) {
    if (results === void 0) {
      results = 6;
    }
    if (slices === void 0) {
      slices = 30;
    }
    var hsl = this.toHsl();
    var part = 360 / slices;
    var ret = [this];
    for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
      hsl.h = (hsl.h + part) % 360;
      ret.push(new TinyColor2(hsl));
    }
    return ret;
  };
  TinyColor2.prototype.complement = function() {
    var hsl = this.toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.monochromatic = function(results) {
    if (results === void 0) {
      results = 6;
    }
    var hsv = this.toHsv();
    var h = hsv.h;
    var s = hsv.s;
    var v = hsv.v;
    var res = [];
    var modification = 1 / results;
    while (results--) {
      res.push(new TinyColor2({ h, s, v }));
      v = (v + modification) % 1;
    }
    return res;
  };
  TinyColor2.prototype.splitcomplement = function() {
    var hsl = this.toHsl();
    var h = hsl.h;
    return [
      this,
      new TinyColor2({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
      new TinyColor2({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
    ];
  };
  TinyColor2.prototype.onBackground = function(background) {
    var fg = this.toRgb();
    var bg = new TinyColor2(background).toRgb();
    return new TinyColor2({
      r: bg.r + (fg.r - bg.r) * fg.a,
      g: bg.g + (fg.g - bg.g) * fg.a,
      b: bg.b + (fg.b - bg.b) * fg.a
    });
  };
  TinyColor2.prototype.triad = function() {
    return this.polyad(3);
  };
  TinyColor2.prototype.tetrad = function() {
    return this.polyad(4);
  };
  TinyColor2.prototype.polyad = function(n) {
    var hsl = this.toHsl();
    var h = hsl.h;
    var result = [this];
    var increment = 360 / n;
    for (var i = 1; i < n; i++) {
      result.push(new TinyColor2({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
    }
    return result;
  };
  TinyColor2.prototype.equals = function(color) {
    return this.toRgbString() === new TinyColor2(color).toRgbString();
  };
  return TinyColor2;
}();

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
      this._server = null;
      if (typeof CustomEvent === "function") {
        const e = new CustomEvent("devicedisconnected", { detail: { device: this } });
        window.dispatchEvent(e);
      }
    });
    this._device = device;
    this._server = await this._device.gatt.connect();
    if (typeof CustomEvent === "function") {
      const e = new CustomEvent("deviceconnected", { detail: { device: this } });
      window.dispatchEvent(e);
    }
    return this;
  }
  async read(characteristic) {
    if (characteristic) {
      return await characteristic.readValue();
    }
    if (!this._warned) {
      console.warn("Characteristic not found. You may need to call connect() first.");
      this._warned = true;
    }
  }
  async write(characteristic, buffer, extra = null) {
    if (characteristic) {
      await characteristic.writeValue(buffer);
    } else if (!this._warned) {
      console.warn("Characteristic not found. You may need to call connect() first.");
      this._warned = true;
    }
    if (typeof CustomEvent === "function") {
      const e = new CustomEvent("devicestatechange", { detail: { device: this, buffer, extra } });
      window.dispatchEvent(e);
    }
  }
  async disconnect() {
    await this.server.device.gatt.disconnect();
    this._server = null;
  }
  get server() {
    return this._server;
  }
  get isConnected() {
    return this._server !== null;
  }
};

// src/light-rgbw/playbulb.js
var COLOR_UUID = 65532;
var COLOR_EFFECT_UUID = 65531;
var _Playbulb = class extends Device {
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
  async setBrightness(value) {
    const color = await this.getColor();
    const a = 1 - value / 255;
    color.setAlpha(a);
    await this.setColor(color);
  }
  async getBrightness() {
    const color = await this.getColor();
    return Math.round((1 - color.getAlpha()) * 255);
  }
  async setColor(value) {
    const color = new TinyColor(value);
    const { r, g, b } = color.toRgb();
    const a = color.getAlpha();
    const w = Math.round((1 - a) * 255);
    await this.write(this._lightCharacteristic, new Uint8Array([w, r, g, b]), color);
  }
  async getColor() {
    const buffer = await this._lightCharacteristic.readValue();
    const a = 1 - buffer.getUint8(0) / 255;
    return new TinyColor({ r: buffer.getUint8(1), g: buffer.getUint8(2), b: buffer.getUint8(3), a });
  }
  async setColorEffect(value, effect = 0, speed = 31) {
    let color;
    if (!value)
      color = await this.getColor();
    else
      color = new TinyColor(value);
    const { r, g, b } = color.toRgb();
    const a = color.getAlpha();
    const w = (1 - a) * 255;
    await this.write(this._effectCharacteristic, new Uint8Array([
      w,
      r,
      g,
      b,
      effect,
      0,
      speed,
      0
    ]), { color, effect, speed });
  }
  async setFlashingColor(value, speed = 31) {
    await this.setColorEffect(value, _Playbulb.FLASH, speed);
  }
  async setCandlingColor(value, speed = 16) {
    await this.setColorEffect(value, _Playbulb.CANDLE, speed);
  }
  async setPulsingColor(value, speed = 3) {
    await this.setColorEffect(value, _Playbulb.PULSE, speed);
  }
  async setRainbowJumpingColor(value, speed = 255) {
    await this.setColorEffect(value, _Playbulb.RAINBOW_JUMP, speed);
  }
  async setRainbowFadingColor(value, speed = 31) {
    await this.setColorEffect(value, _Playbulb.RAINBOW_JFADE, speed);
  }
};
var Playbulb = _Playbulb;
__publicField(Playbulb, "FLASH", 0);
__publicField(Playbulb, "PULSE", 1);
__publicField(Playbulb, "RAINBOW_JUMP", 2);
__publicField(Playbulb, "RAINBOW_JFADE", 3);
__publicField(Playbulb, "CANDLE", 4);

// src/common/pixel-data.js
var PixelData = class {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this.pixels = [];
    this.transformByRowAndColumn(() => [0, 0, 0]);
  }
  set width(value) {
    this._width = value;
    this.pixels = [];
    this.transformByRowAndColumn(() => [0, 0, 0]);
  }
  get width() {
    return this._width;
  }
  set height(value) {
    this._height = value;
    this.pixels = [];
    this.transformByRowAndColumn(() => [0, 0, 0]);
  }
  get height() {
    return this._height;
  }
  clone() {
    const cloned = new PixelData(this._width, this._height);
    cloned.pixels = [...this.pixels];
    return cloned;
  }
  fromImageData(imageData) {
    const data = imageData.data;
    this.transformByRowAndColumn((x, y, pixel, index) => {
      const i = index * 4;
      return [data[i], data[i + 1], data[i + 2]];
    });
    return this;
  }
  fromCanvas(canvas, scale = true) {
    if (scale && canvas.width !== this.width) {
      this.width = canvas.width;
      this.height = canvas.height;
    }
    const { width, height } = this;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, width, height);
    return this.fromImageData(imageData);
  }
  traverseByRowAndColumn(fn) {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const index = y * this._width + x;
        fn(x, y, this.pixels[index], index);
      }
    }
  }
  transformByRowAndColumn(fn) {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const index = y * this._width + x;
        this.pixels[index] = fn(x, y, this.pixels[index], index);
      }
    }
  }
  assertBounds(x, y) {
    if (x < 0 || x > this._width) {
      throw new Error(`x coordinate out of bounds: ${x} > ${this._width}`);
    }
    if (y < 0 || y > this._height) {
      throw new Error(`y coordinate out of bounds: ${y} > ${this._height}`);
    }
  }
  set(x, y, color) {
    this.assertBounds(x, y);
    const oldValue = this.pixels[y * this._width + x];
    this.pixels[y * this._width + x] = color;
    return oldValue;
  }
  get(x, y) {
    this.assertBounds(x, y);
    return this.pixels[y * this._width + x];
  }
};

// src/epaper/utils.js
function int2Bytes(buffer, offset, value, limit) {
  for (let i = 0; i < limit; i++) {
    buffer[offset + i] = value >>> i * 8 & 255;
  }
}

// src/epaper/dither/algorithms/utils.js
function colorDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}
function approximateColor(color, palette) {
  const findIndex = function(fun, arg, list, min) {
    if (list.length === 2) {
      if (fun(arg, min) <= fun(arg, list[1])) {
        return min;
      }
      return list[1];
    }
    const tl = list.slice(1);
    if (fun(arg, min) > fun(arg, list[1])) {
      min = list[1];
    }
    return findIndex(fun, arg, tl, min);
  };
  const foundColor = findIndex(colorDistance, color, palette, palette[0]);
  return foundColor;
}

// src/epaper/dither/algorithms/atkinson.js
function atkinson(uint8data, palette, step, h, w) {
  const d = new Uint8ClampedArray(uint8data);
  const out = new Uint8ClampedArray(uint8data);
  const ratio = 1 / 8;
  const $i = function(x, y) {
    return 4 * x + 4 * y * w;
  };
  let r, g, b, q, i, color, approx, tr, tg, tb, dx, dy, di;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      i = 4 * x + 4 * y * w;
      r = i;
      g = i + 1;
      b = i + 2;
      color = [d[r], d[g], d[b]];
      approx = approximateColor(color, palette);
      q = [];
      q[r] = d[r] - approx[0];
      q[g] = d[g] - approx[1];
      q[b] = d[b] - approx[2];
      d[$i(x + step, y) + 0] += ratio * q[r];
      d[$i(x - step, y + step) + 0] += ratio * q[r];
      d[$i(x, y + step) + 0] += ratio * q[r];
      d[$i(x + step, y + step) + 0] += ratio * q[r];
      d[$i(x + 2 * step, y) + 0] += ratio * q[r];
      d[$i(x, y + 2 * step) + 0] += ratio * q[r];
      d[$i(x + step, y) + 1] += ratio * q[g];
      d[$i(x - step, y + step) + 1] += ratio * q[g];
      d[$i(x, y + step) + 1] += ratio * q[g];
      d[$i(x + step, y + step) + 1] += ratio * q[g];
      d[$i(x + 2 * step, y) + 1] += ratio * q[g];
      d[$i(x, y + 2 * step) + 1] += ratio * q[g];
      d[$i(x + step, y) + 2] += ratio * q[b];
      d[$i(x - step, y + step) + 2] += ratio * q[b];
      d[$i(x, y + step) + 2] += ratio * q[b];
      d[$i(x + step, y + step) + 2] += ratio * q[b];
      d[$i(x + 2 * step, y) + 2] += ratio * q[b];
      d[$i(x, y + 2 * step) + 2] += ratio * q[b];
      tr = approx[0];
      tg = approx[1];
      tb = approx[2];
      for (dx = 0; dx < step; dx++) {
        for (dy = 0; dy < step; dy++) {
          di = i + 4 * dx + 4 * w * dy;
          out[di] = tr;
          out[di + 1] = tg;
          out[di + 2] = tb;
        }
      }
    }
  }
  return out;
}

// src/epaper/dither/algorithms/error-diffusion.js
function errorDiffusion(uint8data, palette, step, h, w) {
  const d = new Uint8ClampedArray(uint8data);
  const out = new Uint8ClampedArray(uint8data);
  const ratio = 1 / 16;
  const $i = function(x, y) {
    return 4 * x + 4 * y * w;
  };
  let r, g, b, q, i, color, approx, tr, tg, tb, dx, dy, di;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      i = 4 * x + 4 * y * w;
      r = i;
      g = i + 1;
      b = i + 2;
      color = [d[r], d[g], d[b]];
      approx = approximateColor(color, palette);
      q = [];
      q[r] = d[r] - approx[0];
      q[g] = d[g] - approx[1];
      q[b] = d[b] - approx[2];
      d[$i(x + step, y)] = d[$i(x + step, y)] + 7 * ratio * q[r];
      d[$i(x - step, y + 1)] = d[$i(x - 1, y + step)] + 3 * ratio * q[r];
      d[$i(x, y + step)] = d[$i(x, y + step)] + 5 * ratio * q[r];
      d[$i(x + step, y + step)] = d[$i(x + 1, y + step)] + Number(ratio) * q[r];
      d[$i(x + step, y) + 1] = d[$i(x + step, y) + 1] + 7 * ratio * q[g];
      d[$i(x - step, y + step) + 1] = d[$i(x - step, y + step) + 1] + 3 * ratio * q[g];
      d[$i(x, y + step) + 1] = d[$i(x, y + step) + 1] + 5 * ratio * q[g];
      d[$i(x + step, y + step) + 1] = d[$i(x + step, y + step) + 1] + Number(ratio) * q[g];
      d[$i(x + step, y) + 2] = d[$i(x + step, y) + 2] + 7 * ratio * q[b];
      d[$i(x - step, y + step) + 2] = d[$i(x - step, y + step) + 2] + 3 * ratio * q[b];
      d[$i(x, y + step) + 2] = d[$i(x, y + step) + 2] + 5 * ratio * q[b];
      d[$i(x + step, y + step) + 2] = d[$i(x + step, y + step) + 2] + Number(ratio) * q[b];
      tr = approx[0];
      tg = approx[1];
      tb = approx[2];
      for (dx = 0; dx < step; dx++) {
        for (dy = 0; dy < step; dy++) {
          di = i + 4 * dx + 4 * w * dy;
          out[di] = tr;
          out[di + 1] = tg;
          out[di + 2] = tb;
        }
      }
    }
  }
  return out;
}

// src/epaper/dither/algorithms/ordered.js
function ordered(uint8data, palette, step, h, w) {
  const d = new Uint8ClampedArray(uint8data);
  const ratio = 3;
  const m = [
    [1, 9, 3, 11],
    [13, 5, 15, 7],
    [4, 12, 2, 10],
    [16, 8, 14, 6]
  ];
  let r, g, b, i, color, approx, tr, tg, tb, dx, dy, di;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      i = 4 * x + 4 * y * w;
      r = i;
      g = i + 1;
      b = i + 2;
      d[r] += m[x % 4][y % 4] * ratio;
      d[g] += m[x % 4][y % 4] * ratio;
      d[b] += m[x % 4][y % 4] * ratio;
      color = [d[r], d[g], d[b]];
      approx = approximateColor(color, palette);
      tr = approx[0];
      tg = approx[1];
      tb = approx[2];
      for (dx = 0; dx < step; dx++) {
        for (dy = 0; dy < step; dy++) {
          di = i + 4 * dx + 4 * w * dy;
          d[di] = tr;
          d[di + 1] = tg;
          d[di + 2] = tb;
        }
      }
    }
  }
  return d;
}

// src/epaper/dither/index.js
var _Dither = class {
  constructor({ algorithm = _Dither.atkinson, step = 1, palette = [[0, 0, 0], [255, 255, 255]] } = {}) {
    this.options = {
      algorithm,
      step,
      palette
    };
  }
  ditherImageData(imageData, options = {}) {
    options = { ...this.options, ...options };
    const ditherFn = options.algorithm;
    const output = ditherFn.call(
      this,
      imageData.data,
      options.palette,
      options.step,
      imageData.height,
      imageData.width
    );
    imageData.data.set(output);
  }
};
var Dither = _Dither;
__publicField(Dither, "atkinson", atkinson);
__publicField(Dither, "errorDiffusion", errorDiffusion);
__publicField(Dither, "ordered", ordered);

// src/epaper/epaper-core.js
var _EpaperCore = class {
  constructor({ width = 250, height = 122, mtu = 127 } = {}) {
    this._width = width;
    this._height = height;
    this._mtu = mtu;
    this._pixelData = new PixelData(width, height);
    this._paintCanvas = new OffscreenCanvas(width, height);
    this._ctx = this._paintCanvas.getContext("2d", { willReadFrequently: true });
    this._dither = new Dither();
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get frameBuffer() {
    return this._pixelData;
  }
  fromImage({ image, x, y, width, height, dither, step, paletteType } = {}) {
    this._ctx.clearRect(0, 0, this.width, this.height);
    this._ctx.fillStyle = "white";
    this._ctx.fillRect(0, 0, this.width, this.height);
    this._ctx.drawImage(image, x, y, width, height, 0, 0, this.width, this.height);
    const imageData = this._ctx.getImageData(0, 0, this.width, this.height);
    let palette;
    if (paletteType === 0) {
      palette = [[0, 0, 0], [255, 255, 255]];
    } else if (paletteType === 1) {
      palette = [[255, 0, 0], [255, 255, 255]];
    } else if (paletteType === 2) {
      palette = [[0, 0, 0], [255, 255, 255], [255, 0, 0]];
    } else {
      throw new Error("Invalid palette type.");
    }
    this._dither.ditherImageData(imageData, {
      algorithm: Dither[dither],
      palette,
      step
    });
    this._pixelData.fromImageData(imageData);
    this._ctx.putImageData(imageData, 0, 0);
    return this._pixelData;
  }
  getARGBData() {
    const argbData = new Uint32Array(this._width * this._height);
    this._pixelData.traverseByRowAndColumn((x, y, color, i) => {
      const c = 4278190080 | color[0] << 16 | color[1] << 8 | color[2];
      argbData[i] = c;
    });
    return argbData;
  }
  encodeFrameBuffer() {
    const { width, height } = this;
    const colorLUT = /* @__PURE__ */ new Map();
    colorLUT.set(4278190080, 0);
    colorLUT.set(4294967295, 1);
    colorLUT.set(4294901760, 3);
    const pixels = this.getARGBData();
    const displayBuffer = new Uint8Array(_EpaperCore.RAM_SIZE);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = pixels[y * width + x];
        const bits = colorLUT.get(color) & 3;
        const y2 = width - 1 - x;
        const index = y2 * 32 + Math.floor(y / 4);
        const shift = (y & 3) << 1;
        displayBuffer[index] |= bits << shift;
      }
    }
    return displayBuffer;
  }
  decodeFrameBuffer(frameBuffer) {
    const { width, height } = this;
    const pixels = new Uint32Array(width * height);
    const colorLUT = [4278190080, 4294967295, 0, 4294901760];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const y2 = width - 1 - x;
        const index = y2 * 32 + Math.floor(y / 4);
        const shift = (y & 3) << 1;
        const px = frameBuffer[index] >>> shift & 3;
        pixels[y * width + x] = colorLUT[px];
      }
    }
    return pixels;
  }
  _getUploadPlayload(frameBuffer, offset) {
    const mtu = this._mtu;
    const action_write = 0;
    const header_size = 6;
    const trunkSize = Math.min(mtu - header_size, _EpaperCore.RAM_SIZE - offset);
    if (trunkSize <= 0) {
      throw new Error("Data out of bound.");
    }
    const data = new Uint8Array(mtu);
    data[0] = action_write;
    int2Bytes(data, 1, offset, 4);
    data[5] = trunkSize & 255;
    data.set(frameBuffer.subarray(offset, offset + trunkSize), header_size);
    return data;
  }
  generateUploadPlayloads(frameBuffer = this.encodeFrameBuffer()) {
    const payloads = [];
    const header_size = 6;
    for (let offset = 0; offset < _EpaperCore.RAM_SIZE; offset += this._mtu - header_size) {
      payloads.push(this._getUploadPlayload(frameBuffer, offset));
    }
    return payloads;
  }
};
var EpaperCore = _EpaperCore;
__publicField(EpaperCore, "RAM_SIZE", 8e3);
__publicField(EpaperCore, "DITHER_AKTINSON", "atkinson");
__publicField(EpaperCore, "DITHER_ORDERED", "ordered");
__publicField(EpaperCore, "DITHER_ERR_DIFFUSION", "errDiffusion");

// src/common/defer.js
function Defer() {
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}

// src/epaper/epaper.js
var READ_UUID = 53251;
var WRITE_UUID = 53250;
var _Epaper = class extends Device {
  constructor({
    filters = [{ namePrefix: "Epaper" }, { namePrefix: "EPD" }],
    optionalServices = [53503]
  } = {}) {
    super({ filters, optionalServices });
    this._core = new EpaperCore({ mtu: _Epaper.MTU });
  }
  get width() {
    return this._core.width;
  }
  get height() {
    return this._core.height;
  }
  get canvas() {
    return this._core._paintCanvas;
  }
  async connect(rebound = true) {
    await super.connect(rebound);
    const service = (await this.server.getPrimaryServices())[0];
    this._readCharacteristic = await service.getCharacteristic(READ_UUID);
    this._writeCharacteristic = await service.getCharacteristic(WRITE_UUID);
    return this;
  }
  async flush() {
    await this.write(this._writeCharacteristic, new Uint8Array([1]));
  }
  async upload() {
    const payloads = this._core.generateUploadPlayloads();
    const mtu = _Epaper.MTU;
    const header_size = 6;
    let offset = 0;
    for (let i = 0; i < payloads.length; i++) {
      const payload = payloads[i];
      await this.write(this._writeCharacteristic, payload);
      offset += mtu - header_size;
      if (typeof CustomEvent === "function") {
        const event = new CustomEvent("epaperprogress", {
          detail: {
            type: "upload",
            percent: Math.min(100, offset * 100 / EpaperCore.RAM_SIZE),
            payload,
            size: EpaperCore.RAM_SIZE
          }
        });
        window.dispatchEvent(event);
      }
    }
  }
  fromImage(image, { x = 0, y = 0, width = this.width, height = this.height, dither = "atkinson", step = 1, paletteType = 0 } = {}) {
    return this._core.fromImage({ image, x, y, width, height, dither, step, paletteType });
  }
  async download() {
    const mtu = _Epaper.MTU;
    const header_size = 6;
    const action_read = 2;
    const request = new Uint8Array(header_size);
    request[0] = action_read;
    let offset = 0;
    const frameBuffer = new Uint8Array(EpaperCore.RAM_SIZE);
    let notificationDefer = null;
    const notificationHandler = (event) => {
      const data = new Uint8Array(event.target.value.buffer);
      if (data[0] === 2 && data[1] === 0) {
        notificationDefer.resolve({ buffer: data.slice(2) });
      } else if (data[0] === 2 && data[1] === 1) {
        notificationDefer.reject(new Error("Read data failed."));
      }
    };
    await this._readCharacteristic.startNotifications();
    this._readCharacteristic.addEventListener("characteristicvaluechanged", notificationHandler);
    while (offset < EpaperCore.RAM_SIZE) {
      int2Bytes(request, 1, offset, 4);
      request[5] = Math.min(mtu - header_size, EpaperCore.RAM_SIZE - offset) & 255;
      notificationDefer = new Defer();
      await this.write(this._writeCharacteristic, request);
      const response = await notificationDefer.promise;
      const trunk = response.buffer;
      frameBuffer.set(trunk, offset);
      offset += mtu - header_size;
      if (typeof CustomEvent === "function") {
        const event = new CustomEvent("epaperprogress", {
          detail: {
            type: "download",
            percent: Math.min(100, offset * 100 / EpaperCore.RAM_SIZE),
            payload: request,
            trunk,
            size: EpaperCore.RAM_SIZE
          }
        });
        window.dispatchEvent(event);
      }
    }
    await this._readCharacteristic.stopNotifications();
    this._readCharacteristic.removeEventListener(
      "characteristicvaluechanged",
      notificationHandler
    );
    return frameBuffer;
  }
};
var Epaper = _Epaper;
__publicField(Epaper, "MTU", 127);

// src/divoom/utils.js
function int2hexlittle(value) {
  if (value > 65535 || value < 0) {
    throw new TypeError("int2hexlittle only supports value between 0 and 65535");
  }
  const byte1 = (value & 255).toString(16).padStart(2, "0");
  const byte2 = (value >> 8 & 255).toString(16).padStart(2, "0");
  return `${byte1}${byte2}`;
}
function number2HexString(int) {
  if (int > 255 || int < 0) {
    throw new Error("number2HexString works only with number between 0 and 255");
  }
  return Math.round(int).toString(16).padStart(2, "0");
}
function boolean2HexString(bool) {
  return bool ? "01" : "00";
}
function color2HexString(color) {
  return new TinyColor(color).toHex();
}
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
  });
}

// src/divoom/message.js
var _START = "01";
var _END = "02";
var TimeboxEvoMessage = class {
  constructor(msg = "") {
    this._message = null;
    this.append(msg);
  }
  _calcCRC() {
    if (!this._message)
      return void 0;
    const msg = this.lengthHS + this._message;
    let sum = 0;
    for (let i = 0, l = msg.length; i < l; i += 2) {
      sum += parseInt(msg.substr(i, 2), 16);
    }
    return sum % 65536;
  }
  get crc() {
    if (!this._message)
      return void 0;
    return this._calcCRC();
  }
  get crcHS() {
    if (!this._message)
      return void 0;
    return int2hexlittle(this.crc);
  }
  get length() {
    if (!this._message)
      return void 0;
    return (this._message.length + 4) / 2;
  }
  get lengthHS() {
    if (!this._message)
      return void 0;
    return int2hexlittle(this.length);
  }
  get payload() {
    return this._message;
  }
  set payload(payload) {
    this._message = payload;
  }
  get message() {
    if (!this._message)
      return void 0;
    return _START + this.lengthHS + this._message + this.crcHS + _END;
  }
  append(msg) {
    if (msg) {
      this._message = this._message ? this._message + msg.toLowerCase() : msg.toLowerCase();
    }
    return this;
  }
  prepend(msg) {
    if (msg) {
      this._message = this._message ? msg.toLowerCase() + this._message : msg.toLowerCase();
    }
    return this;
  }
  toString() {
    return this.message;
  }
};

// src/divoom/matrix.js
var Matrix = class extends PixelData {
  constructor(width = 32, height = 32) {
    super(width, height);
  }
};

// src/divoom/divoom.js
var _Divoom = class {
  constructor({ host = "http://localhost:9527", width = 16, height = 16 } = {}) {
    this._host = host;
    this._matrix = new Matrix(width, height);
    this._canvas = null;
    this._updatePromise = null;
    this._updateDelay = 0;
    this._animationFrames = [];
    this._emulate = false;
    this._visualCanvas = null;
    if (typeof OffscreenCanvas === "function") {
      const self = this;
      class DivoomCanvas extends OffscreenCanvas {
        get width() {
          return super.width;
        }
        get height() {
          return super.height;
        }
        getContext(type, args = {}) {
          if (args.willReadFrequently !== false)
            args.willReadFrequently = true;
          if (type === "2d") {
            if (this._ctx)
              return this._ctx;
            this._ctx = super.getContext(type, args);
            const { fill, stroke, fillRect, strokeRect, fillText, strokeText, drawImage, clearRect } = this._ctx;
            [fill, stroke, fillRect, strokeRect, fillText, strokeText, drawImage, clearRect].forEach((fn) => {
              this._ctx[fn.name] = (...rest) => {
                const ret = fn.apply(this._ctx, rest);
                self.forceUpdate();
                return ret;
              };
            });
            this._ctx._drawImage = drawImage;
            return this._ctx;
          }
          throw new Error(`Only 2d context is supported, not ${type}`);
        }
      }
      this._canvas = new DivoomCanvas(width, height);
    }
  }
  get width() {
    return this._canvas.width;
  }
  get height() {
    return this._canvas.height;
  }
  get canvas() {
    return this._canvas;
  }
  get context() {
    return this.canvas.getContext("2d");
  }
  get matrix() {
    return this._matrix;
  }
  transferCanvasData(canvas = this.canvas, matrix = this.matrix) {
    return matrix.fromCanvas(canvas);
  }
  setUpdateLatency(latency = 0) {
    this._updateDelay = latency;
  }
  forceUpdate() {
    if (!this._updatePromise) {
      this._updatePromise = new Promise((resolve) => {
        if (this._updateDelay <= 0 && typeof requestAnimationFrame === "function") {
          requestAnimationFrame(() => {
            this._updatePromise = null;
            this.update();
            resolve();
          });
        } else {
          setTimeout(() => {
            this._updatePromise = null;
            this.update();
            resolve();
          }, this._updateDelay);
        }
      });
    }
    return this._updatePromise;
  }
  binarize({ context = this.context, threadhold = 16, backgroundColor = "black", foregroundColor } = {}) {
    foregroundColor = foregroundColor || context.fillStyle;
    if (typeof CanvasGradient === "function" && foregroundColor instanceof CanvasGradient) {
      return;
    }
    const { width, height } = context.canvas;
    const imageData = context.getImageData(0, 0, width, height);
    const { data } = imageData;
    const foreground = new TinyColor(foregroundColor).toRgb();
    const background = new TinyColor(backgroundColor).toRgb();
    for (let i = 0; i < data.length; i += 4) {
      const brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (brightness > threadhold) {
        data[i] = foreground.r;
        data[i + 1] = foreground.g;
        data[i + 2] = foreground.b;
      } else {
        data[i] = background.r;
        data[i + 1] = background.g;
        data[i + 2] = background.b;
      }
      data[i + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
  }
  async update() {
    const matrix = this.transferCanvasData();
    const message = this.getStaticImage(matrix);
    await this.send(message);
  }
  async playAnimation(frames = this._animationFrames) {
    const messages = this.getAnimationData(frames);
    await this.send(messages.join(""));
  }
  clearAnimationFrames() {
    this._animationFrames.length = 0;
  }
  appendAnimationFrame(image, delay = 0) {
    let frame;
    if (typeof image.getContext === "function") {
      frame = this.transferCanvasData(image, this._matrix.clone());
    } else if (!(image instanceof Matrix) && typeof OffscreenCanvas === "function") {
      const ofc = new OffscreenCanvas(this.width, this.height);
      ofc.getContext("2d").drawImage(image, 0, 0, this.width, this.height);
      frame = this.transferCanvasData(ofc, this._matrix.clone());
    } else {
      frame = image.clone();
    }
    this._animationFrames.push({ frame, delay });
  }
  setEmulate(value = true) {
    if (value)
      console.warn("Emulation mode is enabled. No data will be send to the device.");
    this._emulate = value;
  }
  async send(message) {
    let ret;
    if (this._emulate) {
      ret = await Promise.resolve({ status: "OK", emulate: true });
    } else {
      const payload = new TimeboxEvoMessage(message).message;
      ret = await (await fetch(`${this._host}/send`, {
        method: "POST",
        body: JSON.stringify({
          payload
        })
      })).json();
    }
    if (typeof CustomEvent === "function") {
      const e = new CustomEvent("devicestatechange", { detail: { device: this, data: ret } });
      window.dispatchEvent(e);
    }
    return ret;
  }
  async isConnected() {
    try {
      const answer = await this.send("460000");
      return answer.status === "OK";
    } catch (ex) {
      return false;
    }
  }
  async setBrightness(brightness) {
    if (brightness < 0 || brightness > 100) {
      throw Error(
        `Brightness must be in percent between 0 and 100 (inclusive). The given value was ${brightness}`
      );
    }
    await this.send(`74${number2HexString(brightness)}`);
  }
  async setDatetime(date = new Date()) {
    const fullYearStr = date.getFullYear().toString().padStart(4, "0");
    const timeCommand = `18${number2HexString(Number(fullYearStr.slice(2))) + number2HexString(Number(fullYearStr.slice(0, 2))) + number2HexString(date.getMonth() + 1) + number2HexString(date.getDate()) + number2HexString(date.getHours()) + number2HexString(date.getMinutes()) + number2HexString(date.getSeconds())}00`;
    await this.send(timeCommand);
  }
  async setTemperatureAndWeather({ temperature = 0, weather = _Divoom.WeatherType.Clear } = {}) {
    const tempStr = number2HexString(temperature);
    const weatherStr = number2HexString(weather);
    await this.send(`5F${tempStr}${weatherStr}`);
  }
  async enterClockMode({
    type = _Divoom.ClockType.FullScreen,
    showTime = true,
    showWeather = true,
    showTemp = true,
    showCalendar = true,
    color = "white"
  } = {}) {
    const prefix = "450001";
    const clockTypeStr = number2HexString(type);
    const panelStr = [showTime, showWeather, showTemp, showCalendar].map(boolean2HexString).join("");
    const colorStr = color2HexString(color);
    await this.send(`${prefix}${clockTypeStr}${panelStr}${colorStr}`);
  }
  async enterLightningMode({
    color = "white",
    brightness = 50,
    type = _Divoom.LightningType.Love
  } = {}) {
    const prefix = "4501";
    const suffix = "01000000";
    const colorStr = color2HexString(color);
    const brightnessStr = number2HexString(brightness);
    const typeStr = number2HexString(type);
    await this.send(`${prefix}${colorStr}${brightnessStr}${typeStr}${suffix}`);
  }
  async enterCloudMode() {
    await this.send("4502");
  }
  async setVJEffect(type = 0) {
    await this.send(`4503${number2HexString(type)}`);
  }
  async playMusicEQ(type = 0) {
    await this.send(`4504${number2HexString(type)}`);
  }
  async enterCustomMode() {
    await this.send("4505");
  }
  async showScoreBoard(player1 = 0, player2 = 0) {
    const prefix = "450600";
    const player1Str = int2hexlittle(player1);
    const player2Str = int2hexlittle(player2);
    await this.send(`${prefix}${player1Str}${player2Str}`);
  }
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
  setColor(color, x, y) {
    const { r, g, b } = new TinyColor(color);
    const originColor = this.getColor(x, y);
    if (r !== originColor.r || g !== originColor.g || b !== originColor.b) {
      this.context.fillStyle = color;
      this.context.fillRect(x, y, 1, 1);
      this.matrix.set(x, y, [r, g, b]);
    }
  }
  setPixel(color, x, y) {
    this.setColor(color, x, y);
  }
  setPixels(color, positions) {
    this.context.fillStyle = color;
    for (let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      const { r, g, b } = new TinyColor(color);
      const originColor = this.getColor(x, y);
      if (r !== originColor.r || g !== originColor.g || b !== originColor.b) {
        this.context.rect(x, y, 1, 1);
        this.matrix.set(x, y, [r, g, b]);
      }
    }
    this.context.fill();
  }
  getColor(x, y, repeat = false) {
    if (repeat) {
      x = (x + this.width) % this.width;
      y = (y + this.height) % this.height;
    }
    const [r, g, b] = this.matrix.get(x, y);
    return new TinyColor({ r, g, b });
  }
  getPixel(x, y) {
    return this.getColor(x, y);
  }
  updateVisualCanvas() {
    const ctx = this._visualContext;
    const pointWidth = this._visualCanvas.width / this.width;
    const pointHeight = this._visualCanvas.height / this.height;
    const matrix = this.matrix;
    this.transferCanvasData();
    matrix.traverseByRowAndColumn((x, y) => {
      const [r, g, b] = matrix.get(x, y);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x * pointWidth + 1, y * pointHeight + 1, pointWidth - 2, pointHeight - 2);
    });
  }
  getVisualCanvas({ width = 320, height = 320 } = {}) {
    if (width % this.width || height % this.height) {
      throw Error("Size must be a multiple of the matrix size");
    }
    if (!this._visualCanvas) {
      this._visualCanvas = document.createElement("canvas");
      this._visualCanvas.width = width;
      this._visualCanvas.height = height;
      this._visualContext = this._visualCanvas.getContext("2d");
    }
    return this._visualCanvas;
  }
  generateImageData(matrix, delay = 0) {
    const frameTimeString = int2hexlittle(delay);
    let paletteTypeString = "00";
    const { colorBufferString, screenBufferString, colorCount } = this.encodeMatrixToFrame(matrix);
    let paletteCountString = colorCount;
    if (matrix.width > 16) {
      paletteCountString = int2hexlittle(paletteCountString);
      paletteTypeString = "03";
    } else {
      paletteCountString = number2HexString(paletteCountString % 256);
    }
    const fsize = 3 + (frameTimeString.length + paletteTypeString.length + paletteCountString.length + colorBufferString.length + screenBufferString.length) / 2;
    const frameSizeString = int2hexlittle(fsize);
    return `aa${frameSizeString}${frameTimeString}${paletteTypeString}${paletteCountString}${colorBufferString}${screenBufferString}`;
  }
  getAnimationData(frames) {
    if (frames.length <= 0) {
      throw new Error("no frames given");
    }
    const frameData = [];
    for (let i = 0; i < frames.length; i++) {
      const { frame, delay } = frames[i];
      frameData.push(this.generateImageData(frame, delay));
    }
    const allData = frameData.join("");
    const totalSize = allData.length / 2;
    const chunkSize = 400;
    const nchunks = Math.ceil(allData.length / chunkSize);
    const chunks = [];
    for (let i = 0; i < nchunks; i++) {
      const body = allData.substr(i * chunkSize, chunkSize);
      let chunkHeader = int2hexlittle(totalSize) + number2HexString(i);
      if (this.type === "max") {
        chunkHeader = int2hexlittle(totalSize) + "0000" + int2hexlittle(i);
      }
      chunks.push(`49${chunkHeader}${body}`);
    }
    return chunks;
  }
  getStaticImage(matrix) {
    const imageData = this.generateImageData(matrix);
    const header = "44000a0a04";
    return header + imageData;
  }
  encodeMatrixToFrame(matrix) {
    const palette = [];
    const paletteIndexMap = /* @__PURE__ */ new Map();
    const screen = [];
    matrix.traverseByRowAndColumn((_x, _y, color) => {
      const stringifiedColor = JSON.stringify(color);
      if (!paletteIndexMap.has(stringifiedColor)) {
        palette.push(color);
        let index = palette.length - 1;
        if (this.type === "max" && index > 932) {
          index = 932;
          let minDist = Infinity;
          for (let i = 0; i < 933; i++) {
            const paletteColor = palette[i];
            const distance = Math.hypot(
              color[0] - paletteColor[0],
              color[1] - paletteColor[1],
              color[2] - paletteColor[2]
            );
            if (distance < minDist) {
              minDist = distance;
              index = i;
            }
          }
        }
        paletteIndexMap.set(stringifiedColor, index);
      }
      screen.push(paletteIndexMap.get(stringifiedColor));
    });
    if (palette.length > 1024) {
      throw new Error(
        `Palette to large: More than 1024 colors (${palette.length})`
      );
    }
    if (this.type === "max" && palette.length > 933) {
      console.warn("too many colors, some colors will be lost");
      palette.length = 933;
    }
    const colorBufferString = palette.map((color) => color.map((c) => number2HexString(c)).join("")).join("");
    const referenceBitLength = Math.max(1, Math.ceil(Math.log2(palette.length)));
    let current = 0;
    let currentIndex = 0;
    let screenBufferString = "";
    screen.forEach((paletteIndex) => {
      const reference = paletteIndex & 2 ** referenceBitLength - 1;
      current |= reference << currentIndex;
      currentIndex += referenceBitLength;
      while (currentIndex >= 8) {
        const lastByte = current & 255;
        current >>= 8;
        currentIndex -= 8;
        screenBufferString += number2HexString(lastByte);
      }
    });
    if (currentIndex !== 0) {
      screenBufferString += number2HexString(current);
    }
    return {
      colorBufferString,
      screenBufferString,
      colorCount: palette.length
    };
  }
};
var Divoom = _Divoom;
__publicField(Divoom, "WeatherType", {
  Sunny: 1,
  Cloudy: 3,
  Stormy: 5,
  Rainy: 6,
  Snowy: 8,
  Foggy: 9
});
__publicField(Divoom, "ClockType", {
  FullScreen: 0,
  Rainbow: 1,
  WithBox: 2,
  AnalogSquare: 3,
  FullScreenNegative: 4,
  AnalogRound: 5
});
__publicField(Divoom, "LightningType", {
  PlainColor: 0,
  Love: 1,
  Plants: 2,
  NoMosquitto: 3,
  Sleeping: 4
});

// src/divoom/pixoo.js
var Pixoo = class extends Divoom {
  constructor({ width = 16, height = 16 } = {}) {
    super({ width, height });
  }
};

// src/divoom/pixoo-max.js
var PixooMax = class extends Divoom {
  constructor({ width = 32, height = 32 } = {}) {
    super({ width, height });
    this.type = "max";
  }
};

// src/common/sleep.js
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/divoom/timebox-mini.js
var LIGHT_SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
var LIGHT_CHARACTERISTIC_UUID = "49535343-1e4d-4bd9-ba61-23c647249616";
var _TimeboxMini = class extends Device {
  constructor({
    filters = [{ namePrefix: "TimeBox" }],
    optionalServices = [LIGHT_SERVICE_UUID],
    width = 11,
    height = 11
  } = {}) {
    super({ filters, optionalServices });
    this._width = width;
    this._height = height;
    this._canvas = new OffscreenCanvas(width, height);
    this._ctx = this._canvas.getContext("2d", { willReadFrequently: true });
    this._animationFrames = [];
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get canvas() {
    return this._canvas;
  }
  async connect(rebound = true) {
    await super.connect(rebound);
    const service = await this.server.getPrimaryService(LIGHT_SERVICE_UUID);
    this._lightCharacteristic = await service.getCharacteristic(LIGHT_CHARACTERISTIC_UUID);
    await this.enterDrawingMode();
    await sleep(100);
    return this;
  }
  encodeCommand(buffer) {
    const payload = new Uint8Array(buffer.length + 4);
    const len = payload.length - 2;
    payload[0] = len & 255;
    payload[1] = len >>> 8 & 255;
    payload.set(buffer, 2);
    const checksum = payload.reduce((a, b) => a + b, 0);
    payload[payload.length - 2] = checksum & 255;
    payload[payload.length - 1] = checksum >>> 8 & 255;
    const extra = payload.filter((value) => value === 1 || value === 2 || value === 3).length;
    const message = new Uint8Array(payload.length + extra + 2);
    let m = 1;
    for (let i = 0; i < payload.length; i++) {
      if (payload[i] === 1) {
        message[m] = 3;
        message[m + 1] = 4;
        m += 2;
      } else if (payload[i] === 2) {
        message[m] = 3;
        message[m + 1] = 5;
        m += 2;
      } else if (payload[i] === 3) {
        message[m] = 3;
        message[m + 1] = 6;
        m += 2;
      } else {
        message[m] = payload[i];
        m++;
      }
    }
    message[0] = 1;
    message[message.length - 1] = 2;
    return message;
  }
  async sendMessage(msg) {
    const command = this.encodeCommand(msg);
    for (let i = 0; i < command.length; i += _TimeboxMini.MTU) {
      await this.write(this._lightCharacteristic, command.slice(i, i + _TimeboxMini.MTU), { msg });
    }
  }
  async enterClockMode(color = "white", type = 0) {
    const { r, g, b } = new TinyColor(color).toRgb();
    const msg = new Uint8Array([
      69,
      0,
      type,
      r,
      g,
      b
    ]);
    await this.sendMessage(msg);
  }
  async enterDrawingMode() {
    const msg = new Uint8Array([
      68,
      0,
      10,
      10,
      4
    ]);
    await this.sendMessage(msg);
  }
  async enterTempMode(color = "white", type = 0) {
    const { r, g, b } = new TinyColor(color).toRgb();
    const msg = new Uint8Array([
      69,
      1,
      type,
      r,
      g,
      b
    ]);
    await this.sendMessage(msg);
  }
  async enterLightMode(color = "white", intensity = 100, mode = 0) {
    const { r, g, b } = new TinyColor(color).toRgb();
    const msg = new Uint8Array([
      69,
      2,
      r,
      g,
      b,
      intensity,
      mode
    ]);
    await this.sendMessage(msg);
  }
  async enterAnimationMode(preset = 0) {
    const msg = new Uint8Array([
      69,
      3,
      preset
    ]);
    await this.sendMessage(msg);
  }
  async setSoundMode(topColor = "red", activeColor = "white", preset = 0) {
    const { r: r1, g: g1, b: b1 } = new TinyColor(topColor).toRgb();
    const { r: r2, g: g2, b: b2 } = new TinyColor(activeColor).toRgb();
    const msg = new Uint8Array([
      69,
      4,
      preset,
      r1,
      g1,
      b1,
      r2,
      g2,
      b2
    ]);
    await this.sendMessage(msg);
  }
  async enterImageMode() {
    const msg = new Uint8Array([
      69,
      5
    ]);
    await this.sendMessage(msg);
  }
  setPixel(color, x, y) {
    return this.setPixels(color, [[x, y]]);
  }
  async setPixels(color, positions) {
    const { r, g, b } = new TinyColor(color).toRgb();
    const p = positions.map(([x, y]) => y * this._width + x);
    const msg = new Uint8Array([
      88,
      r,
      g,
      b,
      p.length,
      ...p
    ]);
    await this.sendMessage(msg);
  }
  encodeImage(image = this._canvas) {
    if (image !== this._canvas) {
      this._ctx.drawImage(image, 0, 0, this._width, this._height);
    }
    const data = this._ctx.getImageData(0, 0, this._width, this._height).data;
    const pixels = new Uint8Array(data.length / 4 * 3);
    for (let i = 0; i < data.length; i += 4) {
      pixels[i / 4 * 3] = data[i];
      pixels[i / 4 * 3 + 1] = data[i + 1];
      pixels[i / 4 * 3 + 2] = data[i + 2];
    }
    const buffer = new Uint8Array(Math.ceil(pixels.length / 2));
    for (let b = 0, i = 0; i < pixels.length; b++, i += 2) {
      if (i === pixels.length - 1) {
        buffer[b] = pixels[i] >> 4;
      } else {
        buffer[b] = pixels[i] >> 4 | pixels[i + 1] >> 4 << 4;
      }
    }
    return buffer;
  }
  async setImage(image) {
    const buffer = this.encodeImage(image);
    const payload = new Uint8Array(buffer.length + 5);
    payload.set([68, 0, 10, 10, 4, ...buffer]);
    await this.sendMessage(payload);
  }
  clearAnimationFrames() {
    this._animationFrames.length = 0;
  }
  appendAnimationFrame(image, duration = 1) {
    const buffer = this.encodeImage(image);
    this._animationFrames.push({ buffer, duration });
  }
  async playAnimation() {
    for (let i = 0; i < this._animationFrames.length; i++) {
      const { buffer, duration } = this._animationFrames[i];
      const payload = new Uint8Array(buffer.length + 8);
      payload.set([73, 0, 10, 10, 4, i, duration, ...buffer]);
      await this.sendMessage(payload);
    }
  }
};
var TimeboxMini = _TimeboxMini;
__publicField(TimeboxMini, "MTU", 127);

// src/divoom/ditoo-plus.js
var DitooPlus = class extends Divoom {
  constructor({ width = 16, height = 16 } = {}) {
    super({ width, height });
  }
};

// src/divoom/backpack.js
var Backpack = class extends Divoom {
  constructor({ width = 16, height = 16 } = {}) {
    super({ width, height });
  }
};

// src/divoom/zooe.js
var Zooe = class extends Divoom {
  constructor({ width = 16, height = 16 } = {}) {
    super({ width, height });
  }
};
export {
  Backpack,
  Device,
  DitooPlus,
  Epaper,
  Pixoo,
  PixooMax,
  Playbulb,
  TimeboxMini,
  TinyColor,
  Zooe,
  loadImage
};
