"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Port_1 = require("./Port");
var Message_1 = require("./Message");
var Port_2 = require("./Port");
var port1 = new Port_1.Port("port15", "/dev/ttyUSB15", "listenRunCommand");
port1.on("listenRunCommand", function (data) {
    console.log(data);
});
port1.open().then(function () {
    port1.excCommand(Port_2.Command.CHECK, new Message_1.Message("", ""));
});
//# sourceMappingURL=test-sms.js.map