"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GSM_1 = require("./GSM");
var Port_1 = require("./Port");
var ports = new Array();
ports.push(new Port_1.Port('sim62', '/dev/ttyUSB14'));
ports.push(new Port_1.Port('sim61', '/dev/ttyUSB15'));
var gsm = new GSM_1.GSM(ports);
//# sourceMappingURL=index.js.map