import {TestPort} from './TestPort';
import {Message} from './Message';
const message=new Message("Test goi tin nhan","0938256706");

const testPort=new TestPort("/dev/ttyUSB0","listenCallback","listenCallBackCheckGsm","listenCallBackReadSms");

testPort.on("listenCallback",(Data)=>{
    console.log(Data)
})

testPort.on("listenCallBackCheckGsm",(data)=>{
    console.log("Check Gsm:"+data.Data)
})

testPort.on("listenCallBackReadSms",(data)=>{
    console.log("Read SMS: "+data.Data)
})

testPort.open().then(()=>{
    //testPort.sendSms(message);
    testPort.checkGsm();
    //testPort.readMessage();
    //testPort.deleteAllSMS()
    //testPort.checkBalance();
})