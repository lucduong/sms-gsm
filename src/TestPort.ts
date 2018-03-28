import * as SerialPort from 'serialport';
import { EventEmitter } from 'events';
import { Message } from './Message';
export enum Command {
    CHECK = 1,
    SEND_SMS = 2,
    READ_SMS = 3,
    DELETE_ALL_SMS=4,
    READ_SMS_INDEX=5,
    CHECK_BALANCE=6,
}
const Readline = SerialPort.parsers.Readline;
const pdu  = require("sms-pdu-node")
export class TestPort extends EventEmitter{
    private _serialPort: SerialPort;
    private _isOpen: Boolean;
    private _parser:EventEmitter;
    private AT_CHECK = "AT+CPIN?";
    private AT_CHECK_SUPPORT_SENDSMS = "AT+CMGF?";
    private AT_CHANGE_MOD_SMS = "AT+CMGF=1";
    private AT_SEND_SMS = "AT+CMGS=\"";
    private AT_READ_UNREAD="AT+CMGL=\"ALL\"";
    private AT_DELETE_ALLSMS="AT+CMGD=1,4";
    private _functionCallBackSendSms:string;
    private _functionCallBackCheckGSM:string;
    private _functionCallBackReadSMS:string;
    private _commandExec: Command;
    private _statusSendSMS: number;
    private _locked: Boolean;
    private _port: String;
    private _readingSMS:boolean;
    constructor(port: String,functionCallBackSendSms:string,functionCallBackCheckGsm:string,functionCallBackreadSms:string){
        super();
        this._isOpen=false;
        this._port=port;
        this._functionCallBackSendSms=functionCallBackSendSms;
        this._functionCallBackCheckGSM=functionCallBackCheckGsm;
        this._functionCallBackReadSMS=functionCallBackreadSms;
        this._serialPort = this.createNewSerialPort(this._port);
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
            if(data.indexOf("+CMTI:")!==-1){ //Có tin nhắn tới
                let array = data.split(',');
                let indexSMS=array[1];
                if(indexSMS){
                    console.log(`Co tin nhăn moi Index SMS: ${indexSMS}`)
                    this.readSMSByIndex(indexSMS);
                }
            }

            if(this._commandExec===Command.SEND_SMS){
               
                if (data.indexOf("+CMGS:") !==-1 && this._statusSendSMS === 0) {
                    this._statusSendSMS = 1;
                } else if (this._statusSendSMS === 1) {
                    this._statusSendSMS = 0;
                    this._locked = false;
                    this._commandExec=Command.READ_SMS;
                    if (data.indexOf("OK")!==-1&&data.length===2) {
                        this.emit(this._functionCallBackSendSms,{status:true})
                    }else{
                        this.emit(this._functionCallBackSendSms,{status:false})
                    }
                }
            }else if(this._commandExec===Command.CHECK){
                this.emit(this._functionCallBackCheckGSM,{Data:data})
            }else if(this._commandExec===Command.CHECK_BALANCE){
                console.log("Kiem tra TK: "+data);
            }else if(this._commandExec===Command.READ_SMS){
                if(data.indexOf('+CMGL:')!==-1){
                    let arrayData=data.split(',');
                    console.log(arrayData[2]);
                    console.log("====================================================")
                }
            }else if(this._commandExec===Command.READ_SMS_INDEX){
                if(data.indexOf("+CMGR:")!==-1){
                    let arrayData=data.split(',');
                    let command=arrayData[0];//Lệnh thực thi
                    let statusSMS=arrayData[1];//Tình trạng tin nhắn
                    let numberMobile=arrayData[2];//Số điện thoại
                    let dateReceive=arrayData[4];//Ngày nhận
                    let timeReceive=arrayData[5];//Ngày nhận
                    console.log("=============Header========================")
                    console.log(`So dien thoai: ${numberMobile}`)
                    console.log("=============End Header========================")
                    this._readingSMS=true;
                }
                else if(data.indexOf("OK")!==-1 && data.length===2){
                    this._readingSMS=false;
                    this._commandExec=Command.READ_SMS;
                    console.log("=============Finish========================")
                }
                else if(this._readingSMS){
                    //this.emit(this._functionCallBackReadSMS,{Data:data})
                    console.log("=============Start body========================")
                    console.log("Noi dung tin nhan: "+data);
                    console.log("=============End Body========================")
                }
               
                //this._commandExec=Command.READ_SMS;
            }
            else if(this._commandExec===Command.DELETE_ALL_SMS){
                console.log(data);
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
        this._commandExec=Command.CHECK;
        this._serialPort.write(this.AT_CHECK);
        this._serialPort.write('\r');
    }

    sendSms(message: Message):void{
        this._commandExec=Command.SEND_SMS;
        this._statusSendSMS=0;
        this._locked=true;
        // const buffer = Buffer.from(message.smsContent);
        // this._serialPort.write(this.AT_CHANGE_MOD_SMS);
        // this._serialPort.write('\r');
        // this._serialPort.write(this.AT_SEND_SMS);
        // this._serialPort.write(message.phoneNumber);
        // this._serialPort.write('"')
        // this._serialPort.write('\r');
        // this._serialPort.write(buffer);
        // this._serialPort.write(new Buffer([0x1A]));
        // this._serialPort.write('^z');
        this._serialPort.write('AT+CMGF?');
        this._serialPort.write('\r');
        
        // const dataPdu=pdu(message.smsContent, message.phoneNumber, null, 16);
        // console.log("Data sau khi convert: "+dataPdu.pdu);
        // this._serialPort.write(this.AT_CHANGE_MOD_SMS);
        // this._serialPort.write('\r');
        // this._serialPort.write(dataPdu.command);
        // this._serialPort.write('\r');
        // this._serialPort.write(dataPdu.pdu);
        // this._serialPort.write('^z');
    }

    readMessage():void{
        this._commandExec=Command.READ_SMS;
        this._serialPort.write(this.AT_READ_UNREAD);
        this._serialPort.write('\r');
    }

    readSMSByIndex(index:number):void{
        this._commandExec=Command.READ_SMS_INDEX;
        this._serialPort.write(`AT+CMGR=${index}`);
        this._serialPort.write('\r');
      
        
    }

    deleteAllSMS():void{
        this._commandExec=Command.DELETE_ALL_SMS;
        this._serialPort.write(this.AT_DELETE_ALLSMS);
        this._serialPort.write('\r');
    }

    checkBalance():void{
        this._commandExec=Command.CHECK_BALANCE;
        this._serialPort.write("AT+CUSD=1,\"*101#\"");
        this._serialPort.write('\r');
    }

}


