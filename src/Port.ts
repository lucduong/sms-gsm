import * as SerialPort from 'serialport';
import { EventEmitter } from 'events';
import { Message } from './Message';
export enum Command {
  CHECK = 1,
  SEND_SMS = 2,
  READ_SMS = 3,
}

export class Port extends EventEmitter {
  private _name: String;
  private _phoneNumber: String;
  private _locked: Boolean;
  private _port: String;
  private _isOpen: Boolean;
  private serialPort: SerialPort;
  private data: Array<any>;
  private AT_CHECK = "AT";
  private AT_CHECK_SUPPORT_SENDSMS = "AT+CMGF?";
  private AT_CHANGE_MOD_SMS = "AT+CUSD=1";
  private AT_SEND_SMS = "AT+CMGS=\"";
  private _commandExec: Command;
  private _message: Message;
  private _statusSendSMS: number;

  constructor(name: String, port: String) {
    super();
    this._name = name;
    this._port = port;
    this.serialPort = this.createNewSerialPort(this._port);
    this._statusSendSMS = 0;
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
      if (this._commandExec === Command.CHECK) {
        if (data.match("OK")) {
          this._locked = false;
          console.log("Check GSM is sucessful")
        }
      } else if (this._commandExec === Command.SEND_SMS) {
        if (data.match("+CMGS") && this._statusSendSMS === 0) {
          this._statusSendSMS = 1;
        } else if (this._statusSendSMS === 1) {
          if (data.match("OK")) {
            this._statusSendSMS = 0;
            this._locked = false;
            console.log("Send SMS Sucessful")
          }
        }
      } else if (this._commandExec === Command.READ_SMS) {
        console.log(data);
      }

      // header
      // body
      // OK
    });
  }

  excCommand(val: Command, message: Message): void {
    this._commandExec = val;
    this._locked = true;
    switch (this.commandExec) {
      case Command.CHECK: {
        this.serialPort.write(this.AT_CHECK);
      }
      case Command.SEND_SMS: {
        const buffer = Buffer.from(message.message);
        this._message = message;
        this.serialPort.write(this.AT_CHANGE_MOD_SMS);
        this.serialPort.write('\r');
        this.serialPort.write(this.AT_SEND_SMS);
        this.serialPort.write(message.phoneNumber);
        this.serialPort.write('"')
        this.serialPort.write('\r');
        this.serialPort.write(buffer);
        this.serialPort.write(new Buffer([0x1A]));
        this.serialPort.write('^z');
      }
    }
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

  get commandExec(): Command {
    return this._commandExec;
  }

  set commandExec(val: Command) {
    this._commandExec = val;
  }
}
