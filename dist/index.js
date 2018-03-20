"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GSM_1 = require("./GSM");
var ports = new Array();
ports.push({ name: 'port1', port: '/dev/ttyUSB0' });
var gsm = new GSM_1.GSM(ports);
//# sourceMappingURL=index.js.map