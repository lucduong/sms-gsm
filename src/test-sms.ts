import { Port } from './Port';
import {Message} from './Message';
import {Command} from './Port';

const port1=new Port("port15","/dev/ttyUSB15","listenRunCommand");

port1.on("listenRunCommand",(data)=>{
    console.log(data);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function CallTest(){
    port1.excCommand(Command.CHECK,new Message("",""));
    await sleep(1000);
    port1.excCommand(Command.SEND_SMS,new Message("Test goi tin nhan1111","0938256706"));
    await sleep(2000);
    port1.excCommand(Command.READ_SMS,new Message("",""));
}