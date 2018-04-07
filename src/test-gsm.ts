import {TestPort} from './TestPort';
import {ConvertPDU} from './convertPdu';
import {Message} from './Message';
const message=new Message("Test gởi tin nhắn chúa ký tự","+84938256706");
const _ = require('lodash');
const SerialPort = require('serialport');
const testPort=new TestPort("COM12");
const convertPDU=new ConvertPDU();
let i=0;
const listPort=[];
testPort.functionCallBackReadSMS="listenCallBackReadSms";
testPort.telco="viettel";
// testPort.on("listenCallback",(Data)=>{
//     console.log(Data)
// })

// testPort.on("listenCallBackCheckGsm",(data)=>{
//     console.log("Check Gsm:"+data.Data)
// })

// SerialPort.list().then((ports)=>{
//     console.log(ports.length)
//     ports.forEach(function(port) {
//         // console.log(port.comName);
//         // console.log(port.pnpId);
//         // console.log(port.manufacturer);
//         let testPortTmp=new TestPort(port.comName);
//         testPortTmp.functionCallBackReadSMS="listenCallBackReadSms";
//         testPortTmp.telco="vinaphone";
//         listPort.push(testPortTmp);
//     });
// }).catch((err)=>{
//     console.log(err);
// })

// listPort.forEach(function(port){
//     port.open().then(()=>{
//         testPort.checkGsm();
//     })
// })

 testPort.open().then(()=>{
     //testPort.checkGsm();
    //testPort.sendSms(message);
    //testPort.deleteAllSMS();
    // setTimeout(function(){
    //     if(i===0){
    //         testPort.readMessage();
    //         i++;
    //     }else{
    //         return;
    //     }
        
    // }, 2000);
    //testPort.deleteSMSIndex(10);
    testPort.readMessage();
    //testPort.resetGsm();
    //testPort.checkBalance();
    //testPort.getOperatorNetwork();
    //testPort.getPhoneNumber();
    //testPort.readSMSByIndex(0);
 })

// var users = [
//     { 'user': 'barney',  'age': 36, 'active': true },
//     { 'user': 'fred',    'age': 40, 'active': false },
//     { 'user': 'pebbles', 'age': 1,  'active': true }
// ];
// var tmp=_.find(users, { 'age': 1, 'active': true });
// console.log(tmp);

// testPort.deleteAllSMS();
// testPort.readMessage();

// let pduData=convertPDU.stringToPDU("Tin nhắn chứa ký tự","+84938256706","+84980200030",16)
// console.log(pduData);
// let convertPdutoText=convertPDU.getPDUMetaInfo(pduData.pduData);
// console.log(convertPdutoText);
testPort.on("listenCallBackReadSms",(data)=>{
    console.log("Read SMS: "+data.data.smsContent)
    if(data.indexSms){
        testPort.deleteSMSIndex(data.indexSms);
    }
})



