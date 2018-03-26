import {TestPort} from './TestPort';
const testPort=new TestPort();
testPort.open().then(()=>{
    testPort.checkGsm();
})