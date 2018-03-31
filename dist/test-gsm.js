"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestPort_1 = require("./TestPort");
var Message_1 = require("./Message");
var message = new Message_1.Message("Test goi tin nhan", "0938256706");
var _ = require('lodash');
var testPort = new TestPort_1.TestPort("/dev/ttyUSB0");
var users = [
    { 'user': 'barney', 'age': 36, 'active': true },
    { 'user': 'fred', 'age': 40, 'active': false },
    { 'user': 'pebbles', 'age': 1, 'active': true }
];
var tmp = _.find(users, { 'age': 1, 'active': true });
console.log(tmp);
//# sourceMappingURL=test-gsm.js.map