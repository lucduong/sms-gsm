"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var convertPdu_1 = require("./convertPdu");
var Message_1 = require("./Message");
var message = new Message_1.Message("Test gởi tin nhắn chúa ký tự", "+84938256706");
var _ = require('lodash');
var SerialPort = require('serialport');
var testPort = new TestPort_1.TestPort("COM12");
var convertPDU = new convertPdu_1.ConvertPDU();
var i = 0;
var listPort = [];
testPort.functionCallBackReadSMS = "listenCallBackReadSms";
testPort.telco = "viettel";
testPort.open().then(function () {
    testPort.readMessage();
});
testPort.on("listenCallBackReadSms", function (data) {
    console.log("Read SMS: " + data.data.smsContent);
    if (data.indexSms) {
        testPort.deleteSMSIndex(data.indexSms);
    }
});
//# sourceMappingURL=test-gsm.js.map