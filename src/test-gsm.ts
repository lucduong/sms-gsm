import {TestPort} from './TestPort';
import {Message} from './Message';
const message=new Message("Test goi tin nhan","0938256706");
const testPort=new TestPort();
testPort.open().then(()=>{
    testPort.sendSms(message);
})