"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sevenbitdefault = new Array('@', '�', '$', '�', '�', '�', '�', '�', '�', '�', '\n', '�', '�', '\r', '�', '�', '\u0394', '_', '\u03a6', '\u0393', '\u039b', '\u03a9', '\u03a0', '\u03a8', '\u03a3', '\u0398', '\u039e', '�', '�', '�', '�', '�', ' ', '!', '"', '#', '�', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '�', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '�', '�', '�', '�', '�', '�', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '�', '�', '�', '�', '�');
var ConvertPDU = (function () {
    function ConvertPDU() {
    }
    ConvertPDU.prototype.MakeNum = function (str) {
        if ((str >= 0) && (str <= 9))
            return str;
        switch (str.toUpperCase()) {
            case "A": return 10;
            case "B": return 11;
            case "C": return 12;
            case "D": return 13;
            case "E": return 14;
            case "F": return 15;
            default:
                0;
                return 'X';
        }
    };
    ConvertPDU.prototype.HexToNum = function (numberS) {
        var tens = this.MakeNum(numberS.substring(0, 1));
        var ones;
        if (numberS.length > 1)
            ones = this.MakeNum(numberS.substring(1, 2));
        if (ones == 'X') {
            return "00";
        }
        var tmp = (tens * 16) + (ones * 1);
        return tmp.toString();
    };
    ConvertPDU.prototype.intToHex = function (i) {
        var sHex = "0123456789ABCDEF";
        var h = "";
        var k = parseInt(i);
        for (var j = 0; j <= 3; j++) {
            h += sHex.charAt((k >> (j * 8 + 4)) & 0x0F) +
                sHex.charAt((k >> (j * 8)) & 0x0F);
        }
        return h.substring(0, 2);
    };
    ConvertPDU.prototype.intToBin = function (x, size) {
        var base = 2;
        var num = parseInt(x);
        var bin = num.toString(base);
        for (var i = bin.length; i < size; i++) {
            bin = "0" + bin;
        }
        return bin;
    };
    ConvertPDU.prototype.ToHex = function (i) {
        var sHex = "0123456789ABCDEF";
        var Out = "";
        Out = sHex.charAt(i & 0xf);
        i >>= 4;
        Out = sHex.charAt(i & 0xf) + Out;
        return Out;
    };
    ConvertPDU.prototype.tpDCSMeaning = function (tp_DCS) {
        var tp_DCS_desc = tp_DCS;
        var pomDCS = parseInt(this.HexToNum(tp_DCS));
        switch (pomDCS & 192) {
            case 0:
                if (pomDCS & 32) {
                    tp_DCS_desc = "Compressed Text\n";
                }
                else {
                    tp_DCS_desc = "Uncompressed Text\n";
                }
                if (pomDCS & 16) {
                    tp_DCS_desc += "No class\n";
                }
                else {
                    tp_DCS_desc += "class:";
                    switch (pomDCS & 3) {
                        case 0:
                            tp_DCS_desc += "0\n";
                            break;
                        case 1:
                            tp_DCS_desc += "1\n";
                            break;
                        case 2:
                            tp_DCS_desc += "2\n";
                            break;
                        case 3:
                            tp_DCS_desc += "3\n";
                            break;
                    }
                }
                tp_DCS_desc += "Alphabet:";
                switch (pomDCS & 12) {
                    case 0:
                        tp_DCS_desc += "Default\n";
                        break;
                    case 4:
                        tp_DCS_desc += "8bit\n";
                        break;
                    case 8:
                        tp_DCS_desc += "UCS2(16)bit\n";
                        break;
                    case 12:
                        tp_DCS_desc += "Reserved\n";
                        break;
                }
                break;
            case 64:
            case 128:
                tp_DCS_desc = "Reserved coding group\n";
                break;
            case 192:
                switch (pomDCS & 0x30) {
                    case 0:
                        tp_DCS_desc = "Message waiting group\n";
                        tp_DCS_desc += "Discard\n";
                        break;
                    case 0x10:
                        tp_DCS_desc = "Message waiting group\n";
                        tp_DCS_desc += "Store Message. Default Alphabet\n";
                        break;
                    case 0x20:
                        tp_DCS_desc = "Message waiting group\n";
                        tp_DCS_desc += "Store Message. UCS2 Alphabet\n";
                        break;
                    case 0x30:
                        tp_DCS_desc = "Data coding message class\n";
                        if (pomDCS & 0x4) {
                            tp_DCS_desc += "Default Alphabet\n";
                        }
                        else {
                            tp_DCS_desc += "8 bit Alphabet\n";
                        }
                        break;
                }
                break;
        }
        return (tp_DCS_desc);
    };
    ConvertPDU.prototype.DCS_Bits = function (tp_DCS) {
        var AlphabetSize = 7;
        var pomDCS = parseInt(this.HexToNum(tp_DCS));
        switch (pomDCS & 192) {
            case 0:
                if (pomDCS & 32) {
                }
                else {
                }
                switch (pomDCS & 12) {
                    case 4:
                        AlphabetSize = 8;
                        break;
                    case 8:
                        AlphabetSize = 16;
                        break;
                }
                break;
            case 192:
                switch (pomDCS & 0x30) {
                    case 0x20:
                        AlphabetSize = 16;
                        break;
                    case 0x30:
                        if (pomDCS & 0x4) {
                            ;
                        }
                        else {
                            AlphabetSize = 8;
                        }
                        break;
                }
                break;
        }
        return (AlphabetSize);
    };
    ConvertPDU.prototype.getSevenBit = function (character) {
        for (var i = 0; i < sevenbitdefault.length; i++) {
            if (sevenbitdefault[i] == character) {
                return i;
            }
        }
        return 0;
    };
    ConvertPDU.prototype.getEightBit = function (character) {
        return character;
    };
    ConvertPDU.prototype.get16Bit = function (character) {
        return character;
    };
    ConvertPDU.prototype.semiOctetToString = function (inp) {
        var out = "";
        for (var i = 0; i < inp.length; i = i + 2) {
            var temp = inp.substring(i, i + 2);
            out = out + temp.charAt(1) + temp.charAt(0);
        }
        return out;
    };
    ConvertPDU.prototype.binToInt = function (x) {
        var total = 0;
        var power = parseInt(x.length) - 1;
        for (var i = 0; i < x.length; i++) {
            if (x.charAt(i) == '1') {
                total = total + Math.pow(2, power);
            }
            power--;
        }
        return total;
    };
    ConvertPDU.prototype.stringToPDU = function (inpString, phoneNumber, smscNumber, size) {
        var bitSize = size;
        var octetFirst = "";
        var octetSecond = "";
        var output = "";
        var SMSC_INFO_LENGTH = 0;
        var SMSC_INFO_LENGTH_STR = "";
        var SMSC_LENGTH = 0;
        var SMSC_NUMBER_FORMAT = "";
        var SMSC = "";
        if (smscNumber != 0) {
            SMSC_NUMBER_FORMAT = "92";
            if (smscNumber.substr(0, 1) == '+') {
                SMSC_NUMBER_FORMAT = "91";
                smscNumber = smscNumber.substr(1);
            }
            else if (smscNumber.substr(0, 1) != '0') {
                SMSC_NUMBER_FORMAT = "91";
            }
            if (smscNumber.length % 2 != 0) {
                smscNumber += "F";
            }
            SMSC = this.semiOctetToString(smscNumber);
            SMSC_INFO_LENGTH = ((SMSC_NUMBER_FORMAT + "" + SMSC).length) / 2;
            SMSC_LENGTH = SMSC_INFO_LENGTH;
        }
        if (SMSC_INFO_LENGTH < 10) {
            SMSC_INFO_LENGTH_STR = "0" + SMSC_INFO_LENGTH;
        }
        var firstOctet = "1100";
        var REIVER_NUMBER_FORMAT = "92";
        if (phoneNumber.substr(0, 1) == '+') {
            REIVER_NUMBER_FORMAT = "91";
            phoneNumber = phoneNumber.substr(1);
        }
        else if (phoneNumber.substr(0, 1) != '0') {
            REIVER_NUMBER_FORMAT = "91";
        }
        var REIVER_NUMBER_LENGTH = this.intToHex(phoneNumber.length);
        if (phoneNumber.length % 2 != 0) {
            phoneNumber += "F";
        }
        var REIVER_NUMBER = this.semiOctetToString(phoneNumber);
        var PROTO_ID = "00";
        var DATA_ENCODING = "00";
        if (bitSize == 8) {
            DATA_ENCODING = "04";
        }
        else if (bitSize == 16) {
            DATA_ENCODING = "08";
        }
        var VALID_PERIOD = "AA";
        var userDataSize;
        if (bitSize == 7) {
            userDataSize = this.intToHex(inpString.length);
            for (var i_1 = 0; i_1 <= inpString.length; i_1++) {
                if (i_1 == inpString.length) {
                    if (octetSecond != "") {
                        output = output + "" + (this.intToHex(this.binToInt(octetSecond)));
                    }
                    break;
                }
                var current = this.intToBin(this.getSevenBit(inpString.charAt(i_1)), 7);
                var currentOctet = void 0;
                if (i_1 != 0 && i_1 % 8 != 0) {
                    octetFirst = current.substring(7 - (i_1) % 8);
                    currentOctet = octetFirst + octetSecond;
                    output = output + "" + (this.intToHex(this.binToInt(currentOctet)));
                    octetSecond = current.substring(0, 7 - (i_1) % 8);
                }
                else {
                    octetSecond = current.substring(0, 7 - (i_1) % 8);
                }
            }
        }
        else if (bitSize == 8) {
            userDataSize = this.intToHex(inpString.length);
            var CurrentByte = 0;
            for (var i_2 = 0; i_2 < inpString.length; i_2++) {
                CurrentByte = this.getEightBit(inpString.charCodeAt(i_2));
                output = output + "" + (this.ToHex(CurrentByte));
            }
        }
        else if (bitSize == 16) {
            userDataSize = this.intToHex(inpString.length * 2);
            var myChar = 0;
            for (var i = 0; i < inpString.length; i++) {
                myChar = this.get16Bit(inpString.charCodeAt(i));
                output = output + "" + (this.ToHex((myChar & 0xff00) >> 8)) + (this.ToHex(myChar & 0xff));
            }
        }
        var header = SMSC_INFO_LENGTH_STR + SMSC_NUMBER_FORMAT + SMSC + firstOctet + REIVER_NUMBER_LENGTH + REIVER_NUMBER_FORMAT + REIVER_NUMBER + PROTO_ID + DATA_ENCODING + VALID_PERIOD + userDataSize;
        var PDU = header + output;
        var lenght = (PDU.length / 2 - SMSC_LENGTH - 1);
        var AT = "AT+CMGW=" + (PDU.length / 2 - SMSC_LENGTH - 1);
        return { length: lenght, pduData: PDU };
    };
    ConvertPDU.prototype.getPDUMetaInfo = function (inp) {
        var PDUString = inp;
        var start = 0;
        var SMSC_lengthInfo = parseInt(this.HexToNum(PDUString.substring(0, 2)));
        var SMSC_info = PDUString.substring(2, 2 + (SMSC_lengthInfo * 2));
        var SMSC_TypeOfAddress = SMSC_info.substring(0, 2);
        var SMSC_Number = SMSC_info.substring(2, 2 + (SMSC_lengthInfo * 2));
        if (SMSC_lengthInfo != 0) {
            SMSC_Number = this.semiOctetToString(SMSC_Number);
            if ((SMSC_Number.substr(SMSC_Number.length - 1, 1) == 'F') || (SMSC_Number.substr(SMSC_Number.length - 1, 1) == 'f')) {
                SMSC_Number = SMSC_Number.substring(0, SMSC_Number.length - 1);
            }
            if (SMSC_TypeOfAddress == 91) {
                SMSC_Number = "+" + SMSC_Number;
            }
        }
        var start_SMSDeleivery = (SMSC_lengthInfo * 2) + 2;
        start = start_SMSDeleivery;
        var firstOctet_SMSDeliver = PDUString.substr(start, 2);
        start = start + 2;
        var Tmp_firstOctet_SMSDeliver = 0;
        Tmp_firstOctet_SMSDeliver = parseInt(this.HexToNum(firstOctet_SMSDeliver));
        if ((Tmp_firstOctet_SMSDeliver & 0x03) == 1) {
            var MessageReference = this.HexToNum(PDUString.substr(start, 2));
            start = start + 2;
            var sender_addressLength = parseInt(this.HexToNum(PDUString.substr(start, 2)));
            if (sender_addressLength % 2 != 0) {
                sender_addressLength += 1;
            }
            start = start + 2;
            var sender_typeOfAddress = PDUString.substr(start, 2);
            start = start + 2;
            var sender_number = this.semiOctetToString(PDUString.substring(start, start + sender_addressLength));
            if ((sender_number.substr(sender_number.length - 1, 1) == 'F') || (sender_number.substr(sender_number.length - 1, 1) == 'f')) {
                sender_number = sender_number.substring(0, sender_number.length - 1);
            }
            if (sender_typeOfAddress == 91) {
                sender_number = "+" + sender_number;
            }
            start += sender_addressLength;
            var tp_PID = PDUString.substr(start, 2);
            start += 2;
            var tp_DCS = PDUString.substr(start, 2);
            var tp_DCS_desc = this.tpDCSMeaning(tp_DCS);
            start += 2;
            var ValidityPeriod = parseInt(this.HexToNum(PDUString.substr(start, 2)));
            start += 2;
            var messageLength = parseInt(this.HexToNum(PDUString.substr(start, 2)));
            start += 2;
            var bitSize = this.DCS_Bits(tp_DCS);
            var userData = "Undefined format";
            if (bitSize == 7) {
                userData = this.getUserMessage(PDUString.substr(start, PDUString.length - start), messageLength);
            }
            else if (bitSize == 8) {
                userData = this.getUserMessage8(PDUString.substr(start, PDUString.length - start), messageLength);
            }
            else if (bitSize == 16) {
                userData = this.getUserMessage16(PDUString.substr(start, PDUString.length - start), messageLength);
            }
            userData = userData.substr(0, messageLength);
            if (bitSize == 16) {
                messageLength /= 2;
            }
            return { smsc: SMSC_Number, sender: sender_number, message: userData, length: messageLength };
        }
        else if ((Tmp_firstOctet_SMSDeliver & 0x03) == 0) {
            var sender_addressLength = parseInt(this.HexToNum(PDUString.substr(start, 2)));
            if (sender_addressLength % 2 != 0) {
                sender_addressLength += 1;
            }
            start = start + 2;
            var sender_typeOfAddress = PDUString.substr(start, 2);
            start = start + 2;
            var sender_number = this.semiOctetToString(PDUString.substring(start, start + sender_addressLength));
            if ((sender_number.substr(sender_number.length - 1, 1) == 'F') || (sender_number.substr(sender_number.length - 1, 1) == 'f')) {
                sender_number = sender_number.substring(0, sender_number.length - 1);
            }
            if (sender_typeOfAddress == 91) {
                sender_number = "+" + sender_number;
            }
            start += sender_addressLength;
            var tp_PID = PDUString.substr(start, 2);
            start += 2;
            var tp_DCS_1 = PDUString.substr(start, 2);
            var tp_DCS_desc_1 = this.tpDCSMeaning(tp_DCS_1);
            start += 2;
            var timeStamp = this.semiOctetToString(PDUString.substr(start, 14));
            var year = timeStamp.substring(0, 2);
            var month = timeStamp.substring(2, 4);
            var day = timeStamp.substring(4, 6);
            var hours = timeStamp.substring(6, 8);
            var minutes = timeStamp.substring(8, 10);
            var seconds = timeStamp.substring(10, 12);
            timeStamp = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
            start += 14;
            var messageLength = parseInt(this.HexToNum(PDUString.substr(start, 2)));
            start += 2;
            var bitSize = this.DCS_Bits(tp_DCS_1);
            var userData = "Undefined format";
            if (bitSize == 7) {
                userData = this.getUserMessage(PDUString.substr(start, PDUString.length - start), messageLength);
            }
            else if (bitSize == 8) {
                userData = this.getUserMessage8(PDUString.substr(start, PDUString.length - start), messageLength);
            }
            else if (bitSize == 16) {
                userData = this.getUserMessage16(PDUString.substr(start, PDUString.length - start), messageLength);
            }
            userData = userData.substr(0, messageLength);
            if (bitSize == 16) {
                messageLength /= 2;
            }
            return { smsc: SMSC_Number, sender: sender_number, message: userData, length: messageLength };
        }
        else {
            return null;
        }
    };
    ConvertPDU.prototype.getUserMessage = function (input, truelength) {
        var byteString = "";
        var octetArray = new Array();
        var restArray = new Array();
        var septetsArray = new Array();
        var s = 1;
        var count = 0;
        var matchcount = 0;
        var smsMessage = "";
        for (var i_3 = 0; i_3 < input.length; i_3 = i_3 + 2) {
            var hex = input.substring(i_3, i_3 + 2);
            byteString = byteString + this.intToBin(this.HexToNum(hex), 8);
        }
        for (var i_4 = 0; i_4 < byteString.length; i_4 = i_4 + 8) {
            octetArray[count] = byteString.substring(i_4, i_4 + 8);
            restArray[count] = octetArray[count].substring(0, (s % 8));
            septetsArray[count] = octetArray[count].substring((s % 8), 8);
            s++;
            count++;
            if (s == 8) {
                s = 1;
            }
        }
        for (var i = 0; i < restArray.length; i++) {
            if (i % 7 == 0) {
                if (i != 0) {
                    smsMessage = smsMessage + sevenbitdefault[this.binToInt(restArray[i - 1])];
                    matchcount++;
                }
                smsMessage = smsMessage + sevenbitdefault[this.binToInt(septetsArray[i])];
                matchcount++;
            }
            else {
                smsMessage = smsMessage + sevenbitdefault[this.binToInt(septetsArray[i] + restArray[i - 1])];
                matchcount++;
            }
        }
        if (matchcount != truelength) {
            smsMessage = smsMessage + sevenbitdefault[this.binToInt(restArray[i - 1])];
        }
        return smsMessage;
    };
    ConvertPDU.prototype.getUserMessage8 = function (input, truelength) {
        var smsMessage = "";
        for (var i = 0; i < input.length; i = i + 2) {
            var hex = input.substring(i, i + 2);
            smsMessage += "" + String.fromCharCode(parseInt(this.HexToNum(hex)));
        }
        return smsMessage;
    };
    ConvertPDU.prototype.getUserMessage16 = function (input, truelength) {
        var smsMessage = "";
        for (var i = 0; i < input.length; i = i + 4) {
            var hex1 = input.substring(i, i + 2);
            var hex2 = input.substring(i + 2, i + 4);
            smsMessage += "" + String.fromCharCode(parseInt(this.HexToNum(hex1)) * 256 + parseInt(this.HexToNum(hex2)));
        }
        return smsMessage;
    };
    return ConvertPDU;
}());
exports.ConvertPDU = ConvertPDU;
//# sourceMappingURL=convertPdu.js.map