import {TestPort} from './TestPort';
import {Message} from './Message';
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const testPort=new TestPort("/dev/ttyUSB0","listenCallback","listenCallBackCheckGsm","listenCallBackReadSms");
import {createDb} from './database.js';
app.use(bodyParser.json())

app.post("/sendSMS",function(req,res){
    const numberSend = req.body.mobile;
    const message=req.body.mobile;

    const result= {status:true};
    const messageSend=new Message(message,numberSend);

    res.send(result);
    
});

const handleSendSMS = (req, res) => {
    const { method } = req;
    const { api_key, api_secret, to, sender, text } = (method === 'GET' ? req.query : req.body);
  
    if (api_key !== 'RpD48RnY56dY3NRWyeHKOXy0djTQRuz6' || api_secret !== 'TX3scXwg9S8rLxE5oz7OWxdH1dxRNb4Y') {
      return res.json({ message: 'Credentials are invalid.' })
    }
  
    if (!to || !/(0)[\d]{9,10}$/.test(to)) {
      return res.json({ message: `Phone number (${to}) is invalid.` });
    }

    const messageSend=new Message(text,to);
    console.log(messageSend);
    testPort.sendSms(messageSend);
    res.json({message: 'OK'})
}

app.get('/api/v1/sms', handleSendSMS);
app.post('/api/v1/sms', handleSendSMS);

app.listen(8888, function () {
    console.log("Server is running");
    testPort.open();
    createDb.then((resolve , reject)=>{
        if(reject){
            console.log(reject)
        }
    });
});

testPort.on("listenCallback",(data)=>{
    console.log("Send sms status: "+data.status);
});