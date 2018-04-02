"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SerialPort = require("serialport");
var events_1 = require("events");
var Message_1 = require("./Message");
var Command;
(function (Command) {
    Command[Command["CHECK"] = 1] = "CHECK";
    Command[Command["SEND_SMS"] = 2] = "SEND_SMS";
    Command[Command["READ_SMS"] = 3] = "READ_SMS";
    Command[Command["DELETE_ALL_SMS"] = 4] = "DELETE_ALL_SMS";
    Command[Command["READ_SMS_INDEX"] = 5] = "READ_SMS_INDEX";
    Command[Command["CHECK_BALANCE"] = 6] = "CHECK_BALANCE";
    Command[Command["GET_OPERATOR"] = 7] = "GET_OPERATOR";
    Command[Command["GET_PHONE_NUMBER"] = 8] = "GET_PHONE_NUMBER";
})(Command = exports.Command || (exports.Command = {}));
var Readline = SerialPort.parsers.Readline;
var pdu = require("sms-pdu-node");
var TestPort = (function (_super) {
    __extends(TestPort, _super);
    function TestPort(port) {
        var _this = _super.call(this) || this;
        _this.AT_CHECK = "AT+CPIN?";
        _this.AT_CHECK_SUPPORT_SENDSMS = "AT+CMGF?";
        _this.AT_CHANGE_MOD_SMS = "AT+CMGF=1";
        _this.AT_SEND_SMS = "AT+CMGS=\"";
        _this.AT_READ_UNREAD = "AT+CMGL=\"REC UNREAD\"";
        _this.AT_DELETE_ALLSMS = "AT+CMGD=1,4";
        _this.AT_GET_OPERATOR = "AT+COPS=?";
        _this.AT_GET_PHONE_NUMBER = "AT+CNUM";
        _this.AT_CHANGE_MOD_RECEIVE_SMS = "AT+CNMI=2,1,0,0,0";
        _this._regexGetBalanceVina = /[\d,]+\s/g;
        _this._regexGetBalanceVietnamemobile = /[\d,.]+\s?[dD]/g;
        _this._isOpen = false;
        _this._port = port;
        _this._serialPort = _this.createNewSerialPort(_this._port);
        _this._parser = _this._serialPort.pipe(new Readline({ delimiter: '\r\n' }));
        _this.bindEnven();
        return _this;
    }
    TestPort.prototype.createNewSerialPort = function (port) {
        return new SerialPort("" + port, {
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            rtscts: true,
            autoOpen: false,
        });
    };
    TestPort.prototype.bindEnven = function () {
        var _this = this;
        this._serialPort.on('open', function () {
            console.log("Open port sucessful");
        });
        this._parser.on('data', function (data) {
            console.log(data);
            if (data.indexOf("+CMTI:") !== -1) {
                var array = data.split(',');
                var indexSMS = array[1];
                if (indexSMS) {
                    console.log("Co tin nh\u0103n moi Index SMS: " + indexSMS);
                    _this.readSMSByIndex(indexSMS);
                }
            }
            if (_this._commandExec === Command.SEND_SMS) {
                if (data.indexOf("+CMGS:") !== -1 && _this._statusSendSMS === 0) {
                    _this._statusSendSMS = 1;
                }
                else if (_this._statusSendSMS === 1) {
                    _this._statusSendSMS = 0;
                    _this._locked = false;
                    _this._commandExec = Command.READ_SMS;
                    if (data.indexOf("OK") !== -1 && data.length === 2) {
                        _this.emit(_this._functionCallBackSendSms, { phonenumber: _this._phonenumberSend, status: true, port: _this._port });
                    }
                    else {
                        _this.emit(_this._functionCallBackSendSms, { phonenumber: _this._phonenumberSend, status: false, port: _this._port });
                    }
                    _this.readMessage();
                }
            }
            else if (_this._commandExec === Command.CHECK) {
                _this.emit(_this._functionCallBackCheckGSM, { Data: data });
            }
            else if (_this._commandExec === Command.CHECK_BALANCE) {
                var balance = "";
                if (_this._telco.indexOf("vinaphone") !== -1) {
                    if (_this._regexGetBalanceVina.test(data)) {
                        console.log("Kiem tra TK: " + data);
                        balance = data.match(_this._regexGetBalanceVina)[0];
                        console.log("So tien trong TK: " + balance);
                        _this.readMessage();
                    }
                }
                else if (_this._telco.indexOf("vietnamobile") !== -1) {
                    if (_this._regexGetBalanceVietnamemobile.test(data)) {
                        console.log("Kiem tra TK: " + data);
                        balance = data.match(_this._regexGetBalanceVietnamemobile)[0];
                        console.log("So tien trong TK: " + balance);
                        _this.readMessage();
                    }
                }
                _this.emit(_this._functionCallBackCheckBalance, { balance: balance, port: _this._port });
            }
            else if (_this._commandExec === Command.GET_OPERATOR) {
                console.log("Thông tin nhà mạng: " + data);
            }
            else if (_this._commandExec === Command.READ_SMS) {
                if (data.indexOf('+CMGL:') !== -1) {
                    var arrayData = data.split(',');
                    console.log(arrayData[2]);
                    console.log("====================================================");
                }
                else {
                }
            }
            else if (_this._commandExec === Command.READ_SMS_INDEX) {
                if (data.indexOf("+CMGR:") !== -1) {
                    var arrayData = data.split(',');
                    var command = arrayData[0];
                    var numberMobile = arrayData[1];
                    var dateReceive = arrayData[2];
                    var timeReceive = arrayData[4];
                    console.log("=============Header========================");
                    console.log("So dien thoai: " + numberMobile);
                    console.log("=============End Header========================");
                    _this._readingSMS = true;
                    _this._smsRead = new Message_1.Message("", numberMobile);
                    _this._smsRead.time = timeReceive;
                }
                else if (data.indexOf("OK") !== -1 && data.length === 2) {
                    _this.emit(_this._functionCallBackReadSMS, { data: _this._smsRead, port: _this._port });
                    _this._readingSMS = false;
                    _this._commandExec = Command.READ_SMS;
                    console.log("=============Finish========================");
                }
                else if (_this._readingSMS) {
                    console.log("=============Start body========================");
                    console.log("Noi dung tin nhan: " + data);
                    console.log("=============End Body========================");
                    _this._smsRead.smsContent = data;
                }
            }
            else if (_this._commandExec === Command.DELETE_ALL_SMS) {
                console.log(data);
            }
        });
    };
    TestPort.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._serialPort.open(function (err) {
                if (err) {
                    return reject(err);
                }
                else {
                    _this._isOpen = true;
                    return resolve(_this._isOpen);
                }
            });
        });
    };
    TestPort.prototype.checkGsm = function () {
        this._commandExec = Command.CHECK;
        this._serialPort.write(this.AT_CHECK);
        this._serialPort.write('\r');
    };
    TestPort.prototype.sendSms = function (message) {
        this._commandExec = Command.SEND_SMS;
        this._statusSendSMS = 0;
        this._locked = true;
        this._phonenumberSend = message.phoneNumber;
        var buffer = Buffer.from(message.smsContent);
        this._serialPort.write(this.AT_CHANGE_MOD_SMS);
        this._serialPort.write('\r');
        this._serialPort.write(this.AT_SEND_SMS);
        this._serialPort.write(message.phoneNumber);
        this._serialPort.write('"');
        this._serialPort.write('\r');
        this._serialPort.write(buffer);
        this._serialPort.write(new Buffer([0x1A]));
        this._serialPort.write('^z');
    };
    TestPort.prototype.checkModeGSM = function () {
        this._serialPort.write('AT+CMGF?');
        this._serialPort.write('\r');
    };
    TestPort.prototype.readMessage = function () {
        this._commandExec = Command.READ_SMS;
        this._serialPort.write(this.AT_READ_UNREAD);
        this._serialPort.write('\r');
    };
    TestPort.prototype.readSMSByIndex = function (index) {
        this._commandExec = Command.READ_SMS_INDEX;
        this._serialPort.write("AT+CMGR=" + index);
        this._serialPort.write('\r');
    };
    TestPort.prototype.getOperatorNetwork = function () {
        this._commandExec = Command.GET_OPERATOR;
        this._serialPort.write(this.AT_GET_OPERATOR);
        this._serialPort.write('\r');
    };
    TestPort.prototype.getPhoneNumber = function () {
        this._commandExec = Command.GET_PHONE_NUMBER;
        this._serialPort.write(this.AT_GET_PHONE_NUMBER);
        this._serialPort.write('\r');
    };
    TestPort.prototype.deleteAllSMS = function () {
        this._commandExec = Command.DELETE_ALL_SMS;
        this._serialPort.write(this.AT_DELETE_ALLSMS);
        this._serialPort.write('\r');
    };
    TestPort.prototype.checkBalance = function () {
        this._commandExec = Command.CHECK_BALANCE;
        this._serialPort.write("AT+CUSD=1,\"*101#\"");
        this._serialPort.write('\r');
    };
    Object.defineProperty(TestPort.prototype, "functionCallBackSendSms", {
        get: function () {
            return this._functionCallBackSendSms;
        },
        set: function (val) {
            this._functionCallBackSendSms = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPort.prototype, "functionCallBackCheckGSM", {
        get: function () {
            return this._functionCallBackCheckGSM;
        },
        set: function (val) {
            this._functionCallBackCheckGSM = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPort.prototype, "functionCallBackReadSMS", {
        get: function () {
            return this._functionCallBackReadSMS;
        },
        set: function (val) {
            this._functionCallBackReadSMS = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPort.prototype, "functionCallBackCheckBalance", {
        get: function () {
            return this._functionCallBackCheckBalance;
        },
        set: function (val) {
            this._functionCallBackCheckBalance = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPort.prototype, "isOpen", {
        get: function () {
            return this._isOpen;
        },
        set: function (val) {
            this._isOpen = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPort.prototype, "telco", {
        get: function () {
            return this._telco;
        },
        set: function (val) {
            this._telco = val;
        },
        enumerable: true,
        configurable: true
    });
    return TestPort;
}(events_1.EventEmitter));
exports.TestPort = TestPort;
//# sourceMappingURL=TestPort.js.map