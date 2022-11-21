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
      const e = new CustomEvent('devicedisconnected', {detail: {device: this}});
      window.dispatchEvent(e);
    });
    this._server = await device.gatt.connect();
    const e = new CustomEvent('deviceconnected', {detail: {device: this}});
    window.dispatchEvent(e);
    return this;
  }

  async disconnect() {
    await this.server.device.gatt.disconnect();
  }

  get server() {
    if(this._server === null) {
      throw new ReferenceError('server is not connected');
    }
    return this._server;
  }
}

export {Device};