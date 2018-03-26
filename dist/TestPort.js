"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SerialPort = require("serialport");
var Readline = SerialPort.parsers.Readline;
var TestPort = (function () {
    function TestPort() {
        this.AT_CHECK = "AT";
        this._isOpen = false;
        this._serialPort = this.createNewSerialPort("/dev/ttyUSB15");
        this._parser = this._serialPort.pipe(new Readline({ delimiter: '\r\n' }));
        this.bindEnven();
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
        this._serialPort.on('open', function () {
            console.log("Open port sucessful");
        });
        this._parser.on('data', function (data) {
            console.log('-----------');
            console.log(data);
            console.log('-----------');
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
        this._serialPort.write(this.AT_CHECK);
        this._serialPort.write('\r');
    };
    return TestPort;
}());
exports.TestPort = TestPort;
//# sourceMappingURL=TestPort.js.map