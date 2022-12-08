# Jcode-Bluetooth

用[码上掘金](https://code.juejin.cn/)操作蓝牙智能设备。

## 已支持设备

-   [x] [Mipow-Playbulb-LED](https://www.mipow.com/products/mipow-smart-bulb) | **GATT ✔︎** | **SPP x**
-   [x] [Mipow-Playbulb-Sphere](https://www.mipow.com/products/playbulb-sphere) | **GATT ✔︎** | **SPP x**
-   [x] [Mipow-Playbulb-Candle](https://www.mipow.com/products/playbulb-candle) | **GATT ✔︎** | **SPP x**
-   [x] [Epaper 蓝牙价签](https://www.cnblogs.com/yanye0xff/p/16049232.html) | **GATT ✔︎** | **SPP x**
-   [x] [Divoom-Timebox-Mini](https://www.divoom-gz.com/product/timebox-mini.html) | **GATT ✔︎** | **SPP x**
-   [x] [Pixoo 16x16](https://divoom.com/products/divoom-pixoo) | **GATT x** | **SPP ✔︎**
-   [x] [Pixoo-Max](https://divoom.com/products/divoom-pixoo-max) | **GATT x** | **SPP ✔︎**
-   [x] [Ditoo-Plus](https://divoom.com/products/divoom-ditooplus) | **GATT x** | **SPP ✔︎**

逐步添加中...

## 使用方法

### 控制Playbulb智能LED

```js
import {Playbulb} from 'https://unpkg.com/jcode-bluetooth@0.1.0/dist/jcode-bluetooth.js';
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

### 控制Pixoo系列像素板

因为Pixoo系列像素板的蓝牙协议是SPP，浏览器Web Bluetooth只支持GATT，所以需要启动本地HTTP服务做一个代理。

准备好设备，通过手机蓝牙调试工具查看设备地址，然后clone本项目到本地，安装依赖后启动server服务：

```bash
npm install && npm run server -- <设备MAC地址>
```

接着就可以在Web上编写代码了，Pixoo对象提供了可操作的canvas对象，你可以直接操作这个对象，绘制内容会自动同步到设备上。

```js
import {PixooMax} from 'https://unpkg.com/jcode-bluetooth@0.1.0/dist/jcode-bluetooth.js';
const p = new PixooMax();
const ctx = p.canvas.getContext('2d');
ctx.fillStyle = 'green';
ctx.fillRect(8, 8, 24, 24);
```

在线示例：[Pixoo-Doodle @码上掘金](https://code.juejin.cn/pen/7169424670876237839)

## 详细文档

- [Playbulb](docs/playbulb-light.md)
- [Epaper](docs/epaper.md)
- [Timebox](docs/timebox.md)
- [Pixoo](docs/pixoo.md)
