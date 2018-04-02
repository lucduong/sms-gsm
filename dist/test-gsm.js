"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var Message_1 = require("./Message");
var message = new Message_1.Message("Test goi tin nhan", "+84938256706");
var _ = require('lodash');
var testPort = new TestPort_1.TestPort("/dev/ttyUSB0");
var i = 0;
testPort.functionCallBackReadSMS = "listenCallBackReadSms";
testPort.telco = "vinaphone";
testPort.open().then(function () {
    testPort.sendSms(message);
});
testPort.on("listenCallBackReadSms", function (data) {
    console.log("Read SMS: " + data);
    if (data.indexSms) {
        testPort.deleteSMSIndex(data.indexSms);
    }
});
//# sourceMappingURL=test-gsm.js.map