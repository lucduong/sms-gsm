"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var convertPdu_1 = require("./convertPdu");
var Message_1 = require("./Message");
var message = new Message_1.Message("Test gởi tin nhắn chúa ký tự", "+84938256706");
var _ = require('lodash');
var SerialPort = require('serialport');
var testPort = new TestPort_1.TestPort("/dev/ttyUSB15");
var testPort1 = new TestPort_1.TestPort("/dev/ttyUSB14");
var convertPDU = new convertPdu_1.ConvertPDU();
var i = 0;
var listPort = [];
testPort.functionCallBackReadSMS = "listenCallBackReadSms";
testPort.telco = "viettel";
testPort.functionCallBackCheckGSM = "listenCallBackCheckGSM";
testPort.functionCallBackGetOperation = "listenCallBackGetOperation";
testPort1.functionCallBackCheckGSM = "listenCallBackCheckGSM";
testPort1.functionCallBackGetOperation = "listenCallBackGetOperation";
testPort.on("listenCallBackCheckGSM", function (Data) {
    console.log(Data);
});
testPort.on("listenCallBackGetOperation", function (Data) {
    console.log(Data);
});
testPort1.on("listenCallBackCheckGSM", function (Data) {
    console.log(Data);
});
testPort1.on("listenCallBackGetOperation", function (Data) {
    console.log(Data);
});
testPort1.open().then(function () {
    testPort1.getOperatorNetwork();
});
testPort.on("listenCallBackReadSms", function (data) {
    console.log("Read SMS: " + data.data.smsContent);
    if (data.indexSms) {
        testPort.deleteSMSIndex(data.indexSms);
    }
});
//# sourceMappingURL=test-gsm.js.map