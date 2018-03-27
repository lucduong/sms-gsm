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
var Command;
(function (Command) {
    Command[Command["CHECK"] = 1] = "CHECK";
    Command[Command["SEND_SMS"] = 2] = "SEND_SMS";
    Command[Command["READ_SMS"] = 3] = "READ_SMS";
    Command[Command["DELETE_ALL_SMS"] = 4] = "DELETE_ALL_SMS";
    Command[Command["READ_SMS_INDEX"] = 5] = "READ_SMS_INDEX";
})(Command = exports.Command || (exports.Command = {}));
var Readline = SerialPort.parsers.Readline;
var TestPort = (function (_super) {
    __extends(TestPort, _super);
    function TestPort(port, functionCallBackSendSms, functionCallBackCheckGsm, functionCallBackreadSms) {
        var _this = _super.call(this) || this;
        _this.AT_CHECK = "AT+CGMI";
        _this.AT_CHECK_SUPPORT_SENDSMS = "AT+CMGF?";
        _this.AT_CHANGE_MOD_SMS = "AT+CUSD=1";
        _this.AT_SEND_SMS = "AT+CMGS=\"";
        _this.AT_READ_UNREAD = "AT+CMGL=\"REC UNREAD\"";
        _this.AT_DELETE_ALLSMS = "AT+CMGD=1,4";
        _this._isOpen = false;
        _this._port = port;
        _this._functionCallBackSendSms = functionCallBackSendSms;
        _this._functionCallBackCheckGSM = functionCallBackCheckGsm;
        _this._functionCallBackReadSMS = functionCallBackreadSms;
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
            if (data.indexOf("+CMTI:") !== -1) {
                var array = data.split(',');
                var indexSMS = array[1];
                if (indexSMS) {
                    console.log("Index SMS: " + indexSMS);
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
                    if (data.indexOf("OK") !== -1 && data.length === 2) {
                        _this.emit(_this._functionCallBackSendSms, { status: true });
                    }
                    else {
                        _this.emit(_this._functionCallBackSendSms, { status: false });
                    }
                }
            }
            else if (_this._commandExec === Command.CHECK) {
                _this.emit(_this._functionCallBackCheckGSM, { Data: data });
            }
            else if (_this._commandExec === Command.READ_SMS) {
                console.log("Read SMS:" + data);
            }
            else if (_this._commandExec === Command.READ_SMS_INDEX) {
                if (data.indexOf("+CMGL:") !== -1) {
                    var arrayData = data.split(',');
                    var command = arrayData[0];
                    var statusSMS = arrayData[1];
                    var numberMobile = arrayData[2];
                    var dateReceive = arrayData[4];
                    var timeReceive = arrayData[5];
                    _this._readingSMS = true;
                }
                if (_this._readingSMS) {
                    _this.emit(_this._functionCallBackReadSMS, { Data: data });
                }
                if (data.indexOf("OK") !== -1 && data.length === 2) {
                    _this._readingSMS = false;
                    _this._commandExec = Command.READ_SMS;
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
        this._commandExec = Command.SEND_SMS;
        this._statusSendSMS = 0;
        this._locked = true;
    };
    TestPort.prototype.readMessage = function () {
        this._commandExec = Command.READ_SMS;
        this._serialPort.write(this.AT_READ_UNREAD);
        this._serialPort.write('\r');
    };
    TestPort.prototype.readSMSByIndex = function (index) {
        this._serialPort.write("AT+CMGR=" + index);
        this._serialPort.write('\r');
        this._commandExec == Command.READ_SMS_INDEX;
    };
    TestPort.prototype.deleteAllSMS = function () {
        this._serialPort.write(this.AT_DELETE_ALLSMS);
        this._serialPort.write('\r');
        this._commandExec == Command.DELETE_ALL_SMS;
    };
    return TestPort;
}(events_1.EventEmitter));
exports.TestPort = TestPort;
//# sourceMappingURL=TestPort.js.map