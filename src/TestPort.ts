import * as SerialPort from 'serialport';
import { EventEmitter } from 'events';
import { Message } from './Message';
import {ConvertPDU} from './convertPdu';
export enum Command {
    CHECK = 1,
    SEND_SMS = 2,
    READ_SMS = 3,
    DELETE_ALL_SMS=4,
    READ_SMS_INDEX=5,
    CHECK_BALANCE=6,
    GET_OPERATOR=7,
    GET_PHONE_NUMBER=8,
    DELETE_SMS_INDEX=9,
}
const Readline = SerialPort.parsers.Readline;
const pdu  = require("sms-pdu-node")
//const listTask=[]

export class TestPort extends EventEmitter{
    private _serialPort: SerialPort;
    private _isOpen: Boolean;
    private _telco:String;
    private _parser:EventEmitter;
    private SMSC_VIETTEL="+84980200030";
    private SMSC_VINA="+8491020005";
    private SMSC_MOBILE="+84900000023";
    private SMSC_VIETNAMOBILE="+84920210015";
    private AT_CHECK = "AT+CPIN?";
    private AT_CHECK_SUPPORT_SENDSMS = "AT+CMGF?";
    private AT_CHANGE_MOD_SMS = "AT+CMGF=0";
    private AT_SEND_SMS = "AT+CMGS=\"";
    private AT_READ_UNREAD="AT+CMGL=1";
    private AT_DELETE_ALLSMS="AT+CMGD=1,4";
    private AT_DELETE_SMS_INDEX="AT+CMGD=";
    private AT_GET_OPERATOR="AT+COPS=?";
    private AT_GET_PHONE_NUMBER="AT+CNUM";
    private AT_CHANGE_MOD_RECEIVE_SMS="AT+CNMI=2,2,0,0,0";
    private _functionCallBackSendSms:string;
    private _functionCallBackCheckGSM:string;
    private _functionCallBackReadSMS:string;
    private _functionCallBackCheckBalance:string;
    private _functionCallBackGetOperation:string;
    private _regexGetBalanceVina=/[\d,]+\s/g;
    private _regexGetBalanceVietnamemobile=/[\d,.]+\s?[dD]/g;
    private _regexRemoveSpecialCharacter=/[^\w\s]/gi;
    private _commandExec: Command;
    private _statusSendSMS: number;
    private _locked: Boolean;
    private _port: String;
    private _readingSMS:boolean;
    private _phonenumberSend:string;
    private _smsRead:Message;
    private _indexReadSMS:Number;
    private _convertPdu:ConvertPDU;
    private _listTak:Array<any>;
    constructor(port: String){
        super();
        this._locked=false;
        this._listTak=new Array();
        this._convertPdu=new ConvertPDU();
        this._isOpen=false;
        this._port=port;
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
                    if(this._locked){
                        //this._listTask.push(this.readSMSByIndex(indexSMS))
                    }else{
                        this.readSMSByIndex(indexSMS);
                    }
                    
                }
            }

            if(this._commandExec===Command.SEND_SMS){
                if (data.indexOf("+CMGS:") !==-1 && this._statusSendSMS === 0) {
                    this._statusSendSMS = 1;
                } else if (this._statusSendSMS === 1) {
                    this._statusSendSMS = 0;
                  
                    this._commandExec=Command.READ_SMS;
                    if (data.indexOf("OK")!==-1&&data.length===2) {
                        this.emit(this._functionCallBackSendSms,{phonenumber:this._phonenumberSend,status:true,port:this._port})
                    }else{
                        this.emit(this._functionCallBackSendSms,{phonenumber:this._phonenumberSend,status:false,port:this._port})
                    }
                    this._locked = false;
                    
                    
                }
            }else if(this._commandExec===Command.CHECK){
                if(data.indexOf("+CPIN: READY")!==-1){
                    this._locked = false;
                    this.emit(this._functionCallBackCheckGSM,{port:this._port,Data:true})
                }else if(data.indexOf("ERROR")!==-1){
                    this._locked = false;
                    this.emit(this._functionCallBackCheckGSM,{port:this._port,Data:false})
                }
                this.excuteTask()
            }else if(this._commandExec===Command.CHECK_BALANCE){
                let balance="";
                if(this._telco.indexOf("vinaphone")!==-1||this._telco.indexOf("mobilephone")!==-1){
                    if(this._regexGetBalanceVina.test(data)){
                        console.log("Kiem tra TK: "+data);
                        balance=data.match(this._regexGetBalanceVina)[0];
                        balance=balance.replace(this._regexRemoveSpecialCharacter,'');//remove special chracter
                        console.log("So tien trong TK: "+balance);
                        
                        this.readMessage();
                    }
                }else if(this._telco.indexOf("vietnamobile")!==-1){
                    if(this._regexGetBalanceVietnamemobile.test(data)){
                        console.log("Kiem tra TK: "+data);
                        balance=data.match(this._regexGetBalanceVietnamemobile)[0];
                        balance=balance.replace(this._regexRemoveSpecialCharacter,'');//remove special chracter
                        console.log("So tien trong TK: "+balance);
                        this.readMessage();
                    }
                }
                this._locked = false;
                this.emit(this._functionCallBackCheckBalance,{balance:balance,port:this._port})
                this.excuteTask()
                
            }else if(this._commandExec===Command.GET_OPERATOR){
                //console.log("Thông tin nhà mạng: "+data);
                
                if(data.toLowerCase().indexOf("viettel")!==-1){
                    this.emit(this._functionCallBackGetOperation,{port:this._port,data:"viettel"});
                }else if(data.toLowerCase().indexOf("vinaphone")!==-1){
                    this.emit(this._functionCallBackGetOperation,{port:this._port,data:"vinaphone"});
                }else if(data.toLowerCase().indexOf("mobilephone")!==-1){
                    this.emit(this._functionCallBackGetOperation,{port:this._port,data:"mobilephone"});
                }else if(data.indexOf("OK")!==-1&&data.length===2){
                    this._locked = false;
                    this.excuteTask()
                }
                
            }else if(this._commandExec===Command.READ_SMS){
                if(data.indexOf('+CMGL:')!==-1){
                    let arrayData=data.split(',');
                    console.log(arrayData[2]);
                    console.log("====================================================")

                }else{
                   //this.changeModeReceiveSMS();
                }
                
            }else if(this._commandExec===Command.READ_SMS_INDEX){
                if(data.indexOf("+CMGR:")!==-1){
                    console.log("==================Header========================");
                    this._readingSMS=true;
                    console.log(data);
                }
                else if(data.indexOf("OK")!==-1 && data.length===2){
                    this._readingSMS=false;
                    this._locked=false;
                    this.emit(this._functionCallBackReadSMS,{data:this._smsRead,port:this._port,indexSms:this._indexReadSMS})
                    this.excuteTask()
                }
                else if(this._readingSMS){
                    console.log("==================Body========================");
                    let tmpDatParePdu=this._convertPdu.getPDUMetaInfo(data);
                    this._smsRead=new Message(tmpDatParePdu.message,tmpDatParePdu.sender);
                    console.log("Body: "+data);
                   
                }
                
            }
            else if(this._commandExec===Command.DELETE_ALL_SMS){
                console.log(data);
                this.readMessage();
            }else if(this._commandExec===Command.DELETE_SMS_INDEX){
                if(data.indexOf("OK")!==-1){
                    this._locked = false;
                    
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
        this._locked=true
        this._commandExec=Command.CHECK;
        this._serialPort.write(this.AT_CHECK);
        this._serialPort.write('\r');
    }

    sendSms(message: Message):void{
        this._commandExec=Command.SEND_SMS;
        this._statusSendSMS=0;
        this._locked=true;
        this._phonenumberSend=message.phoneNumber;
        let dataPDU;
        if(this._telco.toLowerCase()=="vinaphone"){
            dataPDU=this._convertPdu.stringToPDU(message.smsContent,this._phonenumberSend,this.SMSC_VINA,16);
        }
        else if(this._telco.toLowerCase()=="viettel"){
            dataPDU=this._convertPdu.stringToPDU(message.smsContent,this._phonenumberSend,this.SMSC_VIETTEL,16);
        }
        else if(this._telco.toLowerCase()=="mobilephone"){
            dataPDU=this._convertPdu.stringToPDU(message.smsContent,this._phonenumberSend,this.SMSC_MOBILE,16);
        }else{
            dataPDU=this._convertPdu.stringToPDU(message.smsContent,this._phonenumberSend,this.SMSC_VIETNAMOBILE,16);
        }

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
       
        this._serialPort.write(this.AT_CHANGE_MOD_SMS);
        this._serialPort.write('\r');
        this._serialPort.write(`AT+CMGS=${dataPDU.length}`);
        this._serialPort.write('\r');
        this._serialPort.write(dataPDU.pduData);
        this._serialPort.write(new Buffer([0x1A]));
        this._serialPort.write('^z');
    }
    checkModeGSM():void{
        this._locked=true;
        this._serialPort.write('AT+CMGF?');
        this._serialPort.write('\r');
    }

    readMessage():void{
        this._commandExec=Command.READ_SMS;
        this._serialPort.write(this.AT_READ_UNREAD);
        this._serialPort.write('\r');
    }

    readSMSByIndex(index:number):void{
        this._locked=true;
        this._commandExec=Command.READ_SMS_INDEX;
        this._serialPort.write(`AT+CMGF=0 ;+CMGR=${index}`);
        //this._serialPort.write(`AT+CMGR=${index}`);
        this._serialPort.write('\r');
        this._indexReadSMS=index;
    }

    getOperatorNetwork():void{
        this._locked=true;
        this._commandExec=Command.GET_OPERATOR;
        this._serialPort.write(this.AT_GET_OPERATOR);
        this._serialPort.write('\r');
        
    }

    getPhoneNumber():void{
        this._locked=true;
        this._commandExec=Command.GET_PHONE_NUMBER;
        this._serialPort.write(this.AT_GET_PHONE_NUMBER);
        this._serialPort.write('\r');
    }

    deleteAllSMS():void{
        this._commandExec=Command.DELETE_ALL_SMS;
        this._serialPort.write(this.AT_DELETE_ALLSMS);
        this._serialPort.write('\r');
    }

    checkBalance():void{
        this._locked=true;
        this._commandExec=Command.CHECK_BALANCE;
        this._serialPort.write("AT+CUSD=1,\"*101#\"");
        this._serialPort.write('\r');
    }

    deleteSMSIndex(index:Number):void{
        this._locked=true;
        this._commandExec=Command.DELETE_SMS_INDEX;
        this._serialPort.write(this.AT_DELETE_SMS_INDEX+index);
        this._serialPort.write('\r');
    }

    resetGsm():void{
        this._serialPort.write("AT+CFUN=1");
        this._serialPort.write('\r');
    }

    addTask(val:any):void{
        this._listTak.push(val);
    }
    
    private excuteTask():void{
        // if(listTask.length>0){
        //     listTask[0];
        //     listTask.splice(0,1)        
        // }
        //
        console.log( this._listTak.length)
        if ( this._listTak.length > 0) {
            const [task] =  this._listTak;
            const { action, params } = task;
            if (action) action(params);
        }
    }
   

    get functionCallBackSendSms(): string {
        return this._functionCallBackSendSms;
      }
    
    set functionCallBackSendSms(val: string) {
        this._functionCallBackSendSms = val;
    }

    get functionCallBackCheckGSM(): string {
        return this._functionCallBackCheckGSM;
    }
    
    set functionCallBackCheckGSM(val: string) {
        this._functionCallBackCheckGSM = val;
    }

    get functionCallBackReadSMS(): string {
        return this._functionCallBackReadSMS;
      }
    
    set functionCallBackReadSMS(val: string) {
        this._functionCallBackReadSMS = val;
    }

    get functionCallBackCheckBalance(): string {
        return this._functionCallBackCheckBalance;
      }
    
    set functionCallBackCheckBalance(val: string) {
        this._functionCallBackCheckBalance = val;
    }

    get functionCallBackGetOperation(): string {
        return this._functionCallBackGetOperation;
      }
    
    set functionCallBackGetOperation(val: string) {
        this._functionCallBackGetOperation = val;
    }

    get isOpen(): Boolean {
        return this._isOpen;
      }
    
    set isOpen(val: Boolean) {
        this._isOpen = val;
    }

    get isLock(): Boolean {
        return this._locked;
    }
    set isLock(val:Boolean) {
        this._locked = val;
    }
    
    get telco(): String {
        return this._telco;
    }
       
    set telco(val: String) {
        this._telco = val;
    }

    get port(): String {
        return this._port;
    }
}


