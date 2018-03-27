import * as SerialPort from 'serialport';
import { EventEmitter } from 'events';
import { Message } from './Message';
export enum Command {
    CHECK = 1,
    SEND_SMS = 2,
    READ_SMS = 3,
}
const Readline = SerialPort.parsers.Readline;

export class TestPort extends EventEmitter{
    private _serialPort: SerialPort;
    private _isOpen: Boolean;
    private _parser:EventEmitter;
    private AT_CHECK = "AT+CGMI";
    private AT_CHECK_SUPPORT_SENDSMS = "AT+CMGF?";
    private AT_CHANGE_MOD_SMS = "AT+CUSD=1";
    private AT_SEND_SMS = "AT+CMGS=\"";
    private _functionCallBackSendSms:string;
    private _commandExec: Command;
    private _statusSendSMS: number;
    private _locked: Boolean;
    constructor(functionCallBackSendSms:string){
        super();
        this._isOpen=false;
        this._functionCallBackSendSms=functionCallBackSendSms;
        this._serialPort = this.createNewSerialPort("/dev/ttyUSB15");
        this._parser=this._serialPort.pipe(new Readline({ delimiter: '\r\n' }));
        this.bindEnven();
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
    bindEnven():void{
        this._serialPort.on('open',()=>{
            console.log("Open port sucessful");
        });
        this._parser.on('data',data => {
            if(this._commandExec===Command.SEND_SMS){
                this.emit(this._functionCallBackSendSms,{Data:data})
                if (data.indexOf("+CMGS") !==-1 && this._statusSendSMS === 0) {
                    this._statusSendSMS = 1;
                    console.log("Check lenh")
                } else if (this._statusSendSMS === 1) {
                    if (data.indexOf("OK")!==-1) {
                      this._statusSendSMS = 0;
                      this._locked = false;
                      this.emit(this._functionCallBackSendSms,{status:true})
                      console.log("KQ: "+data)
                      console.log("Length: "+data.length)
                    }
                }
            }
        });
    }
    
    open(): Promise<Boolean> {
        return new Promise((resolve, reject) => {
          this._serialPort.open(err => {
            if (err){
                return reject(err);
            }else{
                this._isOpen = true;
                return resolve(this._isOpen);
            } 
          });
        });
    }
    checkGsm():void{
        this._serialPort.write(this.AT_CHECK);
        this._serialPort.write('\r');
    }

    sendSms(message: Message):void{
        const buffer = Buffer.from(message.smsContent);
        this._serialPort.write(this.AT_CHANGE_MOD_SMS);
        this._serialPort.write('\r');
        this._serialPort.write(this.AT_SEND_SMS);
        this._serialPort.write(message.phoneNumber);
        this._serialPort.write('"')
        this._serialPort.write('\r');
        this._serialPort.write(buffer);
        this._serialPort.write(new Buffer([0x1A]));
        this._serialPort.write('^z');
        this._commandExec=Command.SEND_SMS;
        this._statusSendSMS=0;
        this._locked=true;
    }

}


