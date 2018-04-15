import {TestPort} from './TestPort';
import {ConvertPDU} from './convertPdu';
import {Message} from './Message';
const message=new Message("Test gởi tin nhắn chúa ký tự","+84938256706");
const _ = require('lodash');
const SerialPort = require('serialport');
const testPort=new TestPort("/dev/ttyUSB15");
const testPort1=new TestPort("/dev/ttyUSB14");
const convertPDU=new ConvertPDU();
let i=0;
const listPort=[];

testPort.functionCallBackReadSMS="listenCallBackReadSms";
testPort.telco="viettel";
testPort.functionCallBackCheckGSM="listenCallBackCheckGSM"
testPort.functionCallBackGetOperation="listenCallBackGetOperation";
testPort1.functionCallBackCheckGSM="listenCallBackCheckGSM"
testPort1.functionCallBackGetOperation="listenCallBackGetOperation";
testPort.on("listenCallBackCheckGSM",(Data)=>{
    console.log(Data)
})
testPort.on("listenCallBackGetOperation",(Data)=>{
    console.log(Data)
})

testPort1.on("listenCallBackCheckGSM",(Data)=>{
    console.log(Data)
})
testPort1.on("listenCallBackGetOperation",(Data)=>{
    console.log(Data)
})

testPort.open().then(()=>{
    testPort.checkGsm();
   
    if(testPort.isLock){
       testPort.addTask({ action: testPort.getOperatorNetwork, params: { } });
    }else{
        //testPort.getOperatorNetwork();
    }
})

testPort1.open().then(()=>{
    testPort1.checkGsm();
    testPort1.addTask({action:testPort1.getOperatorNetwork,params:{}})
})




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
