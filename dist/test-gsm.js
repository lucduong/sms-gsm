"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var convertPdu_1 = require("./convertPdu");
var Message_1 = require("./Message");
var message = new Message_1.Message("Test gởi tin nhắn chúa ký tự", "+84938256706");
var _ = require('lodash');
var SerialPort = require('serialport');
var testPort1 = new TestPort_1.TestPort("/dev/ttyUSB9");
var convertPDU = new convertPdu_1.ConvertPDU();
var i = 0;
var listPort = [];
testPort1.functionCallBackCheckGSM = "listenCallBackCheckGSM";
testPort1.functionCallBackGetOperation = "listenCallBackGetOperation";
testPort1.functionCallBackGetSimNumber = "callbackGetSimnumber";
testPort1.telco = "mobilephone";
testPort1.on("listenCallBackCheckGSM", function (Data) {
    console.log(Data);
});
testPort1.on("listenCallBackGetOperation", function (Data) {
});
testPort1.on("callbackGetSimnumber", function (data) {
    console.log(data);
});
testPort1.open().then(function () {
    testPort1.sendSms(message);
});
//# sourceMappingURL=test-gsm.js.map