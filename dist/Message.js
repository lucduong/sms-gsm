"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message = (function () {
    function Message(message, phone) {
        this._smsContent = message;
        this._phoneNumber = phone;
    }
    Object.defineProperty(Message.prototype, "smsContent", {
        get: function () {
            return this._smsContent;
        },
        set: function (val) {
            this._smsContent = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "phoneNumber", {
        get: function () {
            return this._phoneNumber;
        },
        set: function (val) {
            this._phoneNumber = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "time", {
        get: function () {
            return this._time;
        },
        set: function (val) {
            this.time = val;
        },
        enumerable: true,
        configurable: true
    });
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=Message.js.map