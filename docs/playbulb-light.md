# Playbulb-light LED 智能灯

用本项目，支持Chrome浏览器使用[Web蓝牙API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)操作Playbulb系列LED智能灯。

[演示地址（含模拟器） @码上掘金](https://code.juejin.cn/api/raw/7172430033741414440?id=7172430033741430824)

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
console.log(device.isConnected); // true
```

### async device.disconnect()

断开连接

```js
await device.disconnect();
console.log(device.isConnected); // false
```

### device.isConnected

判断设备是否已连接

### async device.setBrightness()

设置亮度，范围0-100

```js
await device.connect();
await device.setBrightness(100);
```

### async device.setColor(color)

设置灯泡颜色，支持CSS中任意合法的颜色值，如果是RGBA，则A值对应亮度`0xff * (1 - alpha)`。

```js
await device.connect();
await device.setColor('red'); // 将灯设置为红色
```

### async device.setColorEffect(color, effect, speed)

设置灯泡的颜色效果，effect 效果包括：

- 0x00 闪烁
- 0x01 脉搏/呼吸灯
- 0x02 彩色闪烁
- 0x03 彩色渐变
- 0x04 蜡烛效果

speed 为速度，范围`0x00-0xff`。

### async device.setFlashingColor(color, speed)

设置闪烁颜色，speed 为速度，范围`0x00-0xff`。

### async device.setPulsingColor(color, speed)

设置脉搏颜色，speed 为速度，范围`0x00-0xff`。

### async device.setRainbowJumpingColor(color, speed)

设置彩色闪烁颜色，speed 为速度，范围`0x00-0xff`。

### async device.setRainbowFadingColor(color, speed)

设置彩色渐变颜色，speed 为速度，范围`0x00-0xff`。

### async device.setCandlingColor(color, speed)

设置蜡烛效果颜色，speed 为速度，范围`0x00-0xff`。

### events

device 事件，可在 window 对象上捕获这些事件。

- `deviceconnected` 设备连接成功。
- `devicedisconnected` 设备断开连接。
- `devicestatechange` 设备状态改变，包括亮度、颜色等。