"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var Message_1 = require("./Message");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var testPort = new TestPort_1.TestPort("/dev/ttyUSB0", "listenCallback", "listenCallBackCheckGsm", "listenCallBackReadSms");
app.use(bodyParser.json());
app.post("/sendSMS", function (req, res) {
    var numberSend = req.body.mobile;
    var message = req.body.mobile;
    var result = { status: true };
    var messageSend = new Message_1.Message(message, numberSend);
    res.send(result);
});
var handleSendSMS = function (req, res) {
    var method = req.method;
    var _a = (method === 'GET' ? req.query : req.body), api_key = _a.api_key, api_secret = _a.api_secret, to = _a.to, sender = _a.sender, text = _a.text;
    if (api_key !== 'RpD48RnY56dY3NRWyeHKOXy0djTQRuz6' || api_secret !== 'TX3scXwg9S8rLxE5oz7OWxdH1dxRNb4Y') {
        return res.json({ message: 'Credentials are invalid.' });
    }
    if (!to || !/(84)[\d]{9,10}$/.test(to)) {
        return res.json({ message: "Phone number (" + to + ") is invalid." });
    }
    var messageSend = new Message_1.Message(text, to);
    console.log(messageSend);
    testPort.sendSms(messageSend);
    res.json({ message: 'OK' });
};
app.get('/api/v1/sms', handleSendSMS);
app.post('/api/v1/sms', handleSendSMS);
app.listen(8888, function () {
    console.log("Server is running");
    testPort.open();
});
//# sourceMappingURL=app.js.map