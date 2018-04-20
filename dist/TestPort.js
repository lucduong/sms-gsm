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
var convertPdu_1 = require("./convertPdu");
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
    Command[Command["DELETE_SMS_INDEX"] = 9] = "DELETE_SMS_INDEX";
})(Command = exports.Command || (exports.Command = {}));
var Readline = SerialPort.parsers.Readline;
var pdu = require("sms-pdu-node");
var TestPort = (function (_super) {
    __extends(TestPort, _super);
    function TestPort(port) {
        var _this = _super.call(this) || this;
        _this.SMSC_VIETTEL = "+84980200030";
        _this.SMSC_VINA = "+8491020005";
        _this.SMSC_MOBILE = "+84900000023";
        _this.SMSC_VIETNAMOBILE = "+84920210015";
        _this.AT_CHECK = "AT+CPIN?";
        _this.AT_CHECK_SUPPORT_SENDSMS = "AT+CMGF?";
        _this.AT_CHANGE_MOD_SMS = "AT+CMGF=0";
        _this.AT_SEND_SMS = "AT+CMGS=\"";
        _this.AT_READ_UNREAD = "AT+CMGL=1";
        _this.AT_DELETE_ALLSMS = "AT+CMGD=1,4";
        _this.AT_DELETE_SMS_INDEX = "AT+CMGD=";
        _this.AT_GET_OPERATOR = "AT+COPS=?";
        _this.AT_GET_PHONE_NUMBER = "AT+CNUM";
        _this.AT_CHANGE_MOD_RECEIVE_SMS = "AT+CNMI=2,2,0,0,0";
        _this._regexGetBalanceVina = /[\d,]+\s/g;
        _this._regexGetBalanceVietnamemobile = /[\d,.]+\s?[dD]/g;
        _this._regexRemoveSpecialCharacter = /[^\w\s]/gi;
        _this._locked = false;
        _this._listTak = new Array();
        _this._convertPdu = new convertPdu_1.ConvertPDU();
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
                    if (_this._locked) {
                    }
                    else {
                        _this.readSMSByIndex(indexSMS);
                    }
                }
            }
            if (_this._commandExec === Command.SEND_SMS) {
                if (data.indexOf("+CMGS:") !== -1 && _this._statusSendSMS === 0) {
                    _this._statusSendSMS = 1;
                }
                else if (_this._statusSendSMS === 1) {
                    _this._statusSendSMS = 0;
                    _this._commandExec = Command.READ_SMS;
                    if (data.indexOf("OK") !== -1 && data.length === 2) {
                        _this.emit(_this._functionCallBackSendSms, { phonenumber: _this._phonenumberSend, status: true, port: _this._port });
                    }
                    else {
                        _this.emit(_this._functionCallBackSendSms, { phonenumber: _this._phonenumberSend, status: false, port: _this._port });
                    }
                    _this._locked = false;
                }
            }
            else if (_this._commandExec === Command.CHECK) {
                if (data.indexOf("+CPIN: READY") !== -1) {
                    _this._locked = false;
                    _this.emit(_this._functionCallBackCheckGSM, { port: _this._port, status: true });
                }
                else if (data.indexOf("ERROR") !== -1) {
                    _this._locked = false;
                    _this.emit(_this._functionCallBackCheckGSM, { port: _this._port, status: false });
                }
                _this.excuteTask();
            }
            else if (_this._commandExec === Command.CHECK_BALANCE) {
                var balance = "";
                if (_this._telco.indexOf("vinaphone") !== -1 || _this._telco.indexOf("mobilephone") !== -1) {
                    if (_this._regexGetBalanceVina.test(data)) {
                        console.log("Kiem tra TK: " + data);
                        balance = data.match(_this._regexGetBalanceVina)[0];
                        balance = balance.replace(_this._regexRemoveSpecialCharacter, '');
                        console.log("So tien trong TK: " + balance);
                        _this.readMessage();
                    }
                }
                else if (_this._telco.indexOf("vietnamobile") !== -1) {
                    if (_this._regexGetBalanceVietnamemobile.test(data)) {
                        console.log("Kiem tra TK: " + data);
                        balance = data.match(_this._regexGetBalanceVietnamemobile)[0];
                        balance = balance.replace(_this._regexRemoveSpecialCharacter, '');
                        console.log("So tien trong TK: " + balance);
                        _this.readMessage();
                    }
                }
                _this._locked = false;
                _this.emit(_this._functionCallBackCheckBalance, { balance: balance, port: _this._port });
                _this.excuteTask();
            }
            else if (_this._commandExec === Command.GET_OPERATOR) {
                if (data.toLowerCase().indexOf("viettel") !== -1) {
                    _this.emit(_this._functionCallBackGetOperation, { port: _this._port, data: "viettel" });
                }
                else if (data.toLowerCase().indexOf("vinaphone") !== -1) {
                    _this.emit(_this._functionCallBackGetOperation, { port: _this._port, data: "vinaphone" });
                }
                else if (data.toLowerCase().indexOf("mobilephone") !== -1) {
                    _this.emit(_this._functionCallBackGetOperation, { port: _this._port, data: "mobilephone" });
                }
                else if (data.indexOf("OK") !== -1 && data.length === 2) {
                    _this._locked = false;
                    _this.excuteTask();
                }
                else {
                    _this.emit(_this._functionCallBackGetOperation, { port: _this._port, data: "ERROR" });
                    _this._locked = false;
                    _this.excuteTask();
                }
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
                    console.log("==================Header========================");
                    _this._readingSMS = true;
                    console.log(data);
                }
                else if (data.indexOf("OK") !== -1 && data.length === 2) {
                    _this._readingSMS = false;
                    _this._locked = false;
                    _this.emit(_this._functionCallBackReadSMS, { data: _this._smsRead, port: _this._port, indexSms: _this._indexReadSMS });
                    _this.excuteTask();
                }
                else if (_this._readingSMS) {
                    console.log("==================Body========================");
                    var tmpDatParePdu = _this._convertPdu.getPDUMetaInfo(data);
                    _this._smsRead = new Message_1.Message(tmpDatParePdu.message, tmpDatParePdu.sender);
                    console.log("Body: " + data);
                }
            }
            else if (_this._commandExec === Command.DELETE_ALL_SMS) {
                console.log(data);
                _this.readMessage();
            }
            else if (_this._commandExec === Command.DELETE_SMS_INDEX) {
                if (data.indexOf("OK") !== -1) {
                    _this._locked = false;
                }
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
        this._locked = true;
        this._commandExec = Command.CHECK;
        this._serialPort.write(this.AT_CHECK);
        this._serialPort.write('\r');
    };
    TestPort.prototype.sendSms = function (message) {
        this._commandExec = Command.SEND_SMS;
        this._statusSendSMS = 0;
        this._locked = true;
        this._phonenumberSend = message.phoneNumber;
        var dataPDU;
        if (this._telco.toLowerCase() == "vinaphone") {
            dataPDU = this._convertPdu.stringToPDU(message.smsContent, this._phonenumberSend, this.SMSC_VINA, 16);
        }
        else if (this._telco.toLowerCase() == "viettel") {
            dataPDU = this._convertPdu.stringToPDU(message.smsContent, this._phonenumberSend, this.SMSC_VIETTEL, 16);
        }
        else if (this._telco.toLowerCase() == "mobilephone") {
            dataPDU = this._convertPdu.stringToPDU(message.smsContent, this._phonenumberSend, this.SMSC_MOBILE, 16);
        }
        else {
            dataPDU = this._convertPdu.stringToPDU(message.smsContent, this._phonenumberSend, this.SMSC_VIETNAMOBILE, 16);
        }
        this._serialPort.write(this.AT_CHANGE_MOD_SMS);
        this._serialPort.write('\r');
        this._serialPort.write("AT+CMGS=" + dataPDU.length);
        this._serialPort.write('\r');
        this._serialPort.write(dataPDU.pduData);
        this._serialPort.write(new Buffer([0x1A]));
        this._serialPort.write('^z');
    };
    TestPort.prototype.checkModeGSM = function () {
        this._locked = true;
        this._serialPort.write('AT+CMGF?');
        this._serialPort.write('\r');
    };
    TestPort.prototype.readMessage = function () {
        this._commandExec = Command.READ_SMS;
        this._serialPort.write(this.AT_READ_UNREAD);
        this._serialPort.write('\r');
    };
    TestPort.prototype.readSMSByIndex = function (index) {
        this._locked = true;
        this._commandExec = Command.READ_SMS_INDEX;
        this._serialPort.write("AT+CMGF=0 ;+CMGR=" + index);
        this._serialPort.write('\r');
        this._indexReadSMS = index;
    };
    TestPort.prototype.getOperatorNetwork = function () {
        this._locked = true;
        this._commandExec = Command.GET_OPERATOR;
        this._serialPort.write(this.AT_GET_OPERATOR);
        this._serialPort.write('\r');
    };
    TestPort.prototype.getPhoneNumber = function () {
        this._locked = true;
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
        this._locked = true;
        this._commandExec = Command.CHECK_BALANCE;
        this._serialPort.write("AT+CUSD=1,\"*101#\"");
        this._serialPort.write('\r');
    };
    TestPort.prototype.deleteSMSIndex = function (index) {
        this._locked = true;
        this._commandExec = Command.DELETE_SMS_INDEX;
        this._serialPort.write(this.AT_DELETE_SMS_INDEX + index);
        this._serialPort.write('\r');
    };
    TestPort.prototype.resetGsm = function () {
        this._serialPort.write("AT+CFUN=1");
        this._serialPort.write('\r');
    };
    TestPort.prototype.addTask = function (val) {
        this._listTak.push(val);
    };
    TestPort.prototype.excuteTask = function () {
        console.log(this._listTak.length);
        if (this._listTak.length > 0) {
            var task = this._listTak[0];
            var action = task.action, params = task.params;
            if (action)
                action(params);
        }
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
    Object.defineProperty(TestPort.prototype, "functionCallBackGetOperation", {
        get: function () {
            return this._functionCallBackGetOperation;
        },
        set: function (val) {
            this._functionCallBackGetOperation = val;
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
    Object.defineProperty(TestPort.prototype, "isLock", {
        get: function () {
            return this._locked;
        },
        set: function (val) {
            this._locked = val;
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
    Object.defineProperty(TestPort.prototype, "port", {
        get: function () {
            return this._port;
        },
        enumerable: true,
        configurable: true
    });
    return TestPort;
}(events_1.EventEmitter));
exports.TestPort = TestPort;
//# sourceMappingURL=TestPort.js.map