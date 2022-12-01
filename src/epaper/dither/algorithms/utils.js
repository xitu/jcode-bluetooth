function colorDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function approximateColor(color, palette) {
  const findIndex = function (fun, arg, list, min) {
    if(list.length === 2) {
      if(fun(arg, min) <= fun(arg, list[1])) {
        return min;
      }
      return list[1];
    }
    const tl = list.slice(1);
    if(fun(arg, min) > fun(arg, list[1])) {
      min = list[1];
    }
    return findIndex(fun, arg, tl, min);
  };
  const foundColor = findIndex(colorDistance, color, palette, palette[0]);
  return foundColor;
}
