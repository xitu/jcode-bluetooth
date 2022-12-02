class Device {
  constructor({filters = [], optionalServices = []} = {}) {
    this.filters = filters;
    this.optionalServices = optionalServices;
    this._server = null;
  }

  async connect() {
    const {filters, optionalServices} = this;
    const acceptAllDevices = filters.length <= 0;
    const options = {};
    if(acceptAllDevices) options.acceptAllDevices = true;
    else {
      options.filters = filters;
      options.optionalServices = optionalServices;
    }

    const device = await navigator.bluetooth.requestDevice(options);
    device.addEventListener('gattserverdisconnected', () => {
      this._server = null;
      if(typeof CustomEvent === 'function') {
        const e = new CustomEvent('devicedisconnected', {detail: {device: this}});
        window.dispatchEvent(e);
      }
    });
    this._device = device;

    this._server = await this._device.gatt.connect();
    if(typeof CustomEvent === 'function') {
      const e = new CustomEvent('deviceconnected', {detail: {device: this}});
      window.dispatchEvent(e);
    }
    return this;
  }

  async read(characteristic) {
    if(characteristic) {
      return await characteristic.readValue();
    }
    if(!this._warned) {
      console.warn('Characteristic not found. You may need to call connect() first.');
      this._warned = true;
    }
  }

  async write(characteristic, buffer, extra = null) {
    if(characteristic) {
      await characteristic.writeValue(buffer);
    } else if(!this._warned) {
      console.warn('Characteristic not found. You may need to call connect() first.');
      this._warned = true;
    }

    if(typeof CustomEvent === 'function') {
      const e = new CustomEvent('devicestatechange', {detail: {device: this, buffer, extra}});
      window.dispatchEvent(e);
    }
  }

  async disconnect() {
    await this.server.device.gatt.disconnect();
    this._server = null;
  }

  get server() {
    // if(this._server === null) {
    //   throw new ReferenceError('server is not connected');
    // }
    return this._server;
  }

  get isConnected() {
    return this._server !== null;
  }
}

export {Device};