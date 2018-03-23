import { Port } from './Port';
import {Message} from './Message';
import {Command} from './Port';

const port1=new Port("port15","/dev/ttyUSB15","listenRunCommand");

port1.on("listenRunCommand",(data)=>{
    console.log(data);
});

port1.open().then(()=>{
    port1.excCommand(Command.CHECK,new Message("",""));
})



