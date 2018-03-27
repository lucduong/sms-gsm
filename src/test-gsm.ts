import {TestPort} from './TestPort';
import {Message} from './Message';
const message=new Message("Test goi tin nhan","0938256706");

const testPort=new TestPort("/dev/ttyUSB15","listenCallback","listenCallBackCheckGsm");

testPort.on("listenCallback",(Data)=>{
    console.log(Data)
})

testPort.on("listenCallBackCheckGsm",(Data)=>{
    console.log("Check Gsm:"+Data)
})

testPort.open().then(()=>{
    //testPort.sendSms(message);
    testPort.checkGsm();
})