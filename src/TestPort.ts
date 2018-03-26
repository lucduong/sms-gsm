import * as SerialPort from 'serialport';
import { EventEmitter } from 'events';
const Readline = SerialPort.parsers.Readline;

export class TestPort{
    private _serialPort: SerialPort;
    private _isOpen: Boolean;
    private _parser:EventEmitter;
    private AT_CHECK = "AT+CGMI";
    constructor(){
        //super();
        this._isOpen=false;
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
            console.log(data);
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

}


