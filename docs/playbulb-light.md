# Playbulb-light LED 智能灯

用本项目，支持Chrome浏览器使用[Web蓝牙API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)操作Playbulb系列LED智能灯。

## 支持设备

目前经过测试的设备包括：

1. [智能灯泡](https://www.mipow.com/products/mipow-smart-bulb)

![](https://cdn.shopify.com/s/files/1/1268/0357/products/btl201-show-sp_compact.jpg?v=1582520302)

2. [触碰球](https://www.mipow.com/products/playbulb-sphere)

![](https://cdn.shopify.com/s/files/1/1268/0357/products/301-2_compact.jpg?v=1665794446)

3. [灯泡蜡烛](https://www.mipow.com/products/playbulb-candle)

![](https://cdn.shopify.com/s/files/1/1268/0357/products/btl300-other-5_compact.jpg?v=1593501765)

## API

### class Playbulb

创建 Playblue 智能设备

```js
import {Playbulb} from 'jcode-bluetooth.js';
const device = new Playbulb();
```

### async device.connect()

连接设备

```js
await device.connect();
console.log(device.isConnected()); // true
```

### async device.disconnect()

断开连接

```js
await device.disconnect();
console.log(device.isConnected()); // false
```



### events

device 事件，可在 window 对象上捕获这些事件。