"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var Message_1 = require("./Message");
var message = new Message_1.Message("Test goi tin nhan", "0938256706");
var testPort = new TestPort_1.TestPort();
testPort.open().then(function () {
    testPort.sendSms(message);
});
//# sourceMappingURL=test-gsm.js.map