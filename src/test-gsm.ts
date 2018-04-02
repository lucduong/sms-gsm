import {TestPort} from './TestPort';
import {Message} from './Message';
const message=new Message("Test goi tin nhan","0938256706");
const _ = require('lodash');
const testPort=new TestPort("/dev/ttyUSB0");
let i=0;
testPort.functionCallBackReadSMS="listenCallBackReadSms";
// testPort.on("listenCallback",(Data)=>{
//     console.log(Data)
// })

// testPort.on("listenCallBackCheckGsm",(data)=>{
//     console.log("Check Gsm:"+data.Data)
// })



testPort.open().then(()=>{
    //testPort.checkGsm();
    testPort.sendSms(message);
    //testPort.deleteAllSMS();
    setTimeout(function(){
        if(i===0){
            testPort.readMessage();
            i++;
        }else{
            return;
        }
        
    }, 2000);
   
    //testPort.changeModeReceiveSMS();
    //testPort.checkBalance();
    //testPort.getOperatorNetwork();
    //testPort.getPhoneNumber();
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

testPort.on("listenCallBackReadSms",(data)=>{
    console.log("Read SMS: "+data.Data)
})