import {TestPort} from './TestPort';
import {Message} from './Message';
const message=new Message("Test goi tin nhan","0938256706");

const testPort=new TestPort("/dev/ttyUSB1","listenCallback","listenCallBackCheckGsm","listenCallBackReadSms");

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
    //testPort.checkGsm();
    //testPort.sendSms(message);
    
    //testPort.readMessage();
    //testPort.deleteAllSMS()
    //testPort.checkBalance();
    testPort.getOperatorNetwork();
    //testPort.getPhoneNumber();
})