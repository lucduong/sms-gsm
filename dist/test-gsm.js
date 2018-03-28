"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var Message_1 = require("./Message");
var message = new Message_1.Message("Test goi tin nhan", "0938256706");
var testPort = new TestPort_1.TestPort("/dev/ttyUSB0", "listenCallback", "listenCallBackCheckGsm", "listenCallBackReadSms");
testPort.on("listenCallback", function (Data) {
    console.log(Data);
});
testPort.on("listenCallBackCheckGsm", function (data) {
    console.log("Check Gsm:" + data.Data);
});
testPort.on("listenCallBackReadSms", function (data) {
    console.log("Read SMS: " + data.Data);
});
testPort.open().then(function () {
    testPort.checkGsm();
});
//# sourceMappingURL=test-gsm.js.map