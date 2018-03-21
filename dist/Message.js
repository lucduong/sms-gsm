"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message = (function () {
    function Message(message, phoneNumber) {
        this._message = message;
        this._phoneNumber = phoneNumber;
    }
    Object.defineProperty(Message.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (val) {
            this._message = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "phoneNumber", {
        get: function () {
            return this._phoneNumber;
        },
        set: function (val) {
            this._message = val;
        },
        enumerable: true,
        configurable: true
    });
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=Message.js.map