"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var testPort = new TestPort_1.TestPort();
testPort.open().then(function () {
    testPort.checkGsm();
});
//# sourceMappingURL=test-gsm.js.map