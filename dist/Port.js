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
})(Command = exports.Command || (exports.Command = {}));
var Port = (function (_super) {
    __extends(Port, _super);
    function Port(name, port) {
        var _this = _super.call(this) || this;
        _this.AT_CHECK = "AT";
        _this.AT_CHECK_SUPPORT_SENDSMS = "AT+CMGF?";
        _this.AT_CHANGE_MOD_SMS = "AT+CUSD=1";
        _this.AT_SEND_SMS = "AT+CMGS=\"";
        _this._name = name;
        _this._port = port;
        _this.serialPort = _this.createNewSerialPort(_this._port);
        _this._statusSendSMS = 0;
        _this.bindEvents();
        return _this;
    }
    Port.prototype.createNewSerialPort = function (port) {
        return new SerialPort("" + port, {
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            rtscts: true,
            autoOpen: false,
        });
    };
    Port.prototype.bindEvents = function () {
        var _this = this;
        this.serialPort.on('data', function (data) {
            if (_this._commandExec === Command.CHECK) {
                if (data.match("OK")) {
                    _this._locked = false;
                    console.log("Check GSM is sucessful");
                }
            }
            else if (_this._commandExec === Command.SEND_SMS) {
                if (data.match("+CMGS") && _this._statusSendSMS === 0) {
                    _this._statusSendSMS = 1;
                }
                else if (_this._statusSendSMS === 1) {
                    if (data.match("OK")) {
                        _this._statusSendSMS = 0;
                        _this._locked = false;
                        console.log("Send SMS Sucessful");
                    }
                }
            }
            else if (_this._commandExec === Command.READ_SMS) {
                console.log(data);
            }
        });
    };
    Port.prototype.excCommand = function (val, message) {
        this._commandExec = val;
        this._locked = true;
        switch (this.commandExec) {
            case Command.CHECK: {
                this.serialPort.write(this.AT_CHECK);
            }
            case Command.SEND_SMS: {
                var buffer = Buffer.from(message.message);
                this._message = message;
                this.serialPort.write(this.AT_CHANGE_MOD_SMS);
                this.serialPort.write('\r');
                this.serialPort.write(this.AT_SEND_SMS);
                this.serialPort.write(message.phoneNumber);
                this.serialPort.write('"');
                this.serialPort.write('\r');
                this.serialPort.write(buffer);
                this.serialPort.write(new Buffer([0x1A]));
                this.serialPort.write('^z');
            }
        }
    };
    Port.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.serialPort.open(function (err) {
                if (err)
                    return reject(err);
                _this._isOpen = true;
                return resolve(_this._isOpen);
            });
        });
    };
    Port.prototype.clearBuffer = function () {
    };
    Object.defineProperty(Port.prototype, "isOpen", {
        get: function () {
            return this._isOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Port.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Port.prototype, "port", {
        get: function () {
            return this._port;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Port.prototype, "commandExec", {
        get: function () {
            return this._commandExec;
        },
        set: function (val) {
            this._commandExec = val;
        },
        enumerable: true,
        configurable: true
    });
    return Port;
}(events_1.EventEmitter));
exports.Port = Port;
//# sourceMappingURL=Port.js.map