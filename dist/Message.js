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
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "phoneNumber", {
        get: function () {
            return this._phoneNumber;
        },
        enumerable: true,
        configurable: true
    });
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=Message.js.map