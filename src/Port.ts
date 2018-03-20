import * as SerialPort from 'serialport';
import { EventEmitter } from 'events';

export class Port extends EventEmitter {
  private _name: String;
  private _phoneNumber: String;
  private _locked: Boolean;
  private _port: String;
  private _isOpen: Boolean;
  private serialPort: SerialPort;
  private data: Array<any>;


  constructor(name: String, port: String) {
    super();
    this._name = name;
    this._port = port;
    this.serialPort = this.createNewSerialPort(this._port);
    this.bindEvents();
  }

  createNewSerialPort(port: String): SerialPort {
    return new SerialPort(`${port}`, {
      baudRate: 115200,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      rtscts: true,
      autoOpen: false,
    });
  }

  bindEvents(): void {
    this.serialPort.on('data', data => {
      // Dau tien. command.
      if (data === 'command X') {
        // 
      }

      // header
      // body
      // OK
    });
  }

  open(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.serialPort.open(err => {
        if (err) return reject(err);
        this._isOpen = true;
        return resolve(this._isOpen);
      });
    });
  }

  private clearBuffer(): void {
  }

  get isOpen(): Boolean {
    return this._isOpen;
  }

  get name(): String {
    return this._name;
  }

  get port(): String {
    return this._port;
  }
}
