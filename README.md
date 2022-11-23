# Jcode-Bluetooth

用[码上掘金](https://code.juejin.cn/)操作蓝牙智能设备。

## 已支持设备

-   [x] [Mipow-Playbulb-LED](https://www.aliexpress.com/item/1005003339962930.html) | **GATT ✔︎** | **SPP x**
-   [x] [Pixoo 16x16](https://divoom.com/products/divoom-pixoo) | **GATT x** | **SPP ✔︎**
-   [x] [Pixoo-Max](https://divoom.com/products/divoom-pixoo-max) | **GATT x** | **SPP ✔︎**

逐步添加中...

## 使用方法

### 控制Playbulb智能LED

```js
import {Playbulb} from './jcode-ble.js';
const device = new Playbulb();
const button = document.querySelector('button');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
button.addEventListener('click', async () => {
  await device.connect();
  let hue = 0;
  while (true) {
    await device.setColor(`hsl(${hue}, 100%, 50%)`);
    hue = (hue + 1) % 360;
    await sleep(100);
  }
});
```

