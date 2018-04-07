const sevenbitdefault = new Array('@', '�', '$', '�', '�', '�', '�', '�', '�', '�', '\n', '�', '�', '\r','�', '�','\u0394', '_', '\u03a6', '\u0393', '\u039b', '\u03a9', '\u03a0','\u03a8', '\u03a3', '\u0398', '\u039e','�', '�', '�', '�', '�', ' ', '!', '"', '#', '�', '%', '&', '\'', '(', ')','*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7','8', '9', ':', ';', '<', '=', '>', '?', '�', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S','T', 'U', 'V', 'W', 'X', 'Y', 'Z', '�', '�', '�', '�', '�', '�', 'a','b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o','p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '�', '�', '�','�', '�');
export class ConvertPDU{
    // helper function for HexToNum
    MakeNum(str) 
    {
        if((str >= 0) && (str <= 9))
            return str;
        switch(str.toUpperCase()) 
        {
            case "A": return 10;
            case "B": return 11;
            case "C": return 12;
            case "D": return 13;
            case "E": return 14;
            case "F": return 15;
            default:  0;
            return 'X';
        }
    }
    // function to convert a Hexnumber into a 10base number
    HexToNum(numberS):string
    {
        let tens = this.MakeNum(numberS.substring(0,1));
        let ones;
        if(numberS.length > 1) // means two characters entered
            ones=this.MakeNum(numberS.substring(1,2));
        if(ones == 'X') 
        {
            return "00";
        }
        let tmp=(tens * 16) + (ones * 1);
        return tmp.toString();
    }
    intToHex(i):string 
    {
        let sHex = "0123456789ABCDEF";	
        let h = ""; 
        let k = parseInt(i);	
        for(let j = 0; j <= 3; j++)
        {
            h += sHex.charAt((k >> (j * 8 + 4)) & 0x0F) +
                sHex.charAt((k >> (j * 8)) & 0x0F);
        }
        return h.substring(0,2);
    }

    intToBin(x,size) //sp
    {
        var base = 2;
        var num = parseInt(x);
        var bin = num.toString(base);
        for(var i=bin.length;i<size;i++)
        {
            bin = "0" + bin;
        }
        return bin;
    }

    ToHex(i):string
    {
        let sHex = "0123456789ABCDEF";
        let Out = "";

        Out = sHex.charAt(i&0xf);
        i>>=4;
        Out = sHex.charAt(i&0xf) + Out;

        return Out;
    }


    tpDCSMeaning(tp_DCS)
    {
            var tp_DCS_desc=tp_DCS;
            let pomDCS = parseInt(this.HexToNum(tp_DCS)); 	
            switch(pomDCS & 192)
            {
            case 0: if(pomDCS & 32)
                {
                    tp_DCS_desc="Compressed Text\n";
                }
                else
                {
                    tp_DCS_desc="Uncompressed Text\n";
                }
                if(pomDCS & 16)
                {
                    tp_DCS_desc+="No class\n";
                }
                else
                {
                    tp_DCS_desc+="class:";	

                    switch(pomDCS & 3)
                    {
                        case 0:
                            tp_DCS_desc+="0\n";
                            break;
                        case 1:
                            tp_DCS_desc+="1\n";
                            break;
                        case 2:
                            tp_DCS_desc+="2\n";
                            break;
                        case 3:
                            tp_DCS_desc+="3\n";
                            break;
                    }	
                }
                            tp_DCS_desc+="Alphabet:";
                switch(pomDCS & 12)
                {
                    case 0:
                        tp_DCS_desc+="Default\n";
                        break;
                    case 4:
                        tp_DCS_desc+="8bit\n";
                        break;
                    case 8:
                        tp_DCS_desc+="UCS2(16)bit\n";
                        break;
                    case 12:
                        tp_DCS_desc+="Reserved\n";
                        break;
                }
                break;
                    case 64:
                    case 128: 
                tp_DCS_desc ="Reserved coding group\n";
                break;
            case 192:
                switch(pomDCS & 0x30)
                {
                    case 0:
                        tp_DCS_desc ="Message waiting group\n";
                        tp_DCS_desc+="Discard\n";
                        break;
                    case 0x10:
                        tp_DCS_desc ="Message waiting group\n";
                        tp_DCS_desc+="Store Message. Default Alphabet\n";
                        break;
                    case 0x20:
                        tp_DCS_desc ="Message waiting group\n";
                        tp_DCS_desc+="Store Message. UCS2 Alphabet\n";
                        break;
                    case 0x30:
                        tp_DCS_desc ="Data coding message class\n";
                        if (pomDCS & 0x4)
                        {
                            tp_DCS_desc+="Default Alphabet\n";
                        }
                        else
                        {
                            tp_DCS_desc+="8 bit Alphabet\n";
                        }
                        break;
                }
                break;
                    
        }

        //alert(tp_DCS.valueOf());
            
            return(tp_DCS_desc); 
    }


    DCS_Bits(tp_DCS)
    {
        let AlphabetSize=7; // Set Default
        let pomDCS =parseInt(this.HexToNum(tp_DCS)); 	
    
            switch(pomDCS & 192)
        {
            case 0: if(pomDCS & 32)
                {
                    // tp_DCS_desc="Compressed Text\n";
                }
                else
                {
                    // tp_DCS_desc="Uncompressed Text\n";
                }
                switch(pomDCS & 12)
                {
                    case 4:
                        AlphabetSize=8;
                        break;
                    case 8:
                        AlphabetSize=16;
                        break;
                }
                break;
            case 192:
                switch(pomDCS & 0x30)
                {
                    case 0x20:
                        AlphabetSize=16;
                        break;
                    case 0x30:
                        if (pomDCS & 0x4)
                        {
                            ;
                        }
                        else
                        {
                            AlphabetSize=8;
                        }
                        break;
                }
                break;
                    
        }

            return(AlphabetSize); 
    }

    getSevenBit(character):Number //sp
    {
        for(let i=0;i<sevenbitdefault.length;i++)
        {
            if(sevenbitdefault[i] == character)
            {
                return i;
            }
        }
        //alert("No 7 bit char!");
        return 0;
    }

    getEightBit(character):any
    {
        return character;
    }

    get16Bit(character):any
    {
        return character;
    }

    // function to convert semioctets to a string
    semiOctetToString(inp):string //sp
    {
        let out = "";	
        for(let i=0;i<inp.length;i=i+2)
        {
            let temp = inp.substring(i,i+2);	
            out = out + temp.charAt(1) + temp.charAt(0);
        }

        return out;
    }

    // function te convert a bit string into a integer
    binToInt(x)//sp
    {
        let total = 0;	
        let power = parseInt(x.length)-1;	

        for(let i=0;i<x.length;i++)
        {
            if(x.charAt(i) == '1')
            {
                total = total +Math.pow(2,power);
            }
            power --;
        }
        return total;
    }
    stringToPDU(inpString,phoneNumber,smscNumber,size){
        let bitSize = size;
        let octetFirst = "";
        let octetSecond = ""; 
        let output = "";

	    //Make header
        let SMSC_INFO_LENGTH = 0;
        let SMSC_INFO_LENGTH_STR="";
        let SMSC_LENGTH = 0;
        let SMSC_NUMBER_FORMAT = "";
        let SMSC = "";
    
        if (smscNumber != 0)
        {
            SMSC_NUMBER_FORMAT = "92"; // national

            if (smscNumber.substr(0,1) == '+')
            {
                SMSC_NUMBER_FORMAT = "91"; // international
                smscNumber = smscNumber.substr(1);
            }
            else if (smscNumber.substr(0,1) !='0')
            {
                SMSC_NUMBER_FORMAT = "91"; // international
            }

            if(smscNumber.length%2 != 0)
            {
                // add trailing F
                smscNumber += "F";
            }	
        
            SMSC = this.semiOctetToString(smscNumber);
            SMSC_INFO_LENGTH = ((SMSC_NUMBER_FORMAT + "" + SMSC).length)/2;
            SMSC_LENGTH = SMSC_INFO_LENGTH;
        }
    
        if(SMSC_INFO_LENGTH < 10)
        {
            SMSC_INFO_LENGTH_STR = "0" + SMSC_INFO_LENGTH;
        }
    
        let firstOctet = "1100";
	
        let REIVER_NUMBER_FORMAT = "92"; // national
    
        if (phoneNumber.substr(0,1) == '+')
        {
            REIVER_NUMBER_FORMAT = "91"; // international
            phoneNumber = phoneNumber.substr(1); //,phoneNumber.length-1);
        }
        else if (phoneNumber.substr(0,1) !='0')
        {
            REIVER_NUMBER_FORMAT = "91"; // international
        }
    
        let REIVER_NUMBER_LENGTH = this.intToHex(phoneNumber.length);

        if(phoneNumber.length%2 != 0)
        {
            // add trailing F
            phoneNumber += "F";
        }
    
        let REIVER_NUMBER = this.semiOctetToString(phoneNumber);

        let PROTO_ID = "00";
        let DATA_ENCODING = "00"; // Default
        if (bitSize == 8)
        {
            DATA_ENCODING = "04";
        }
        else if (bitSize == 16)
        {
            DATA_ENCODING = "08";
        }
        let VALID_PERIOD = "AA";

        let userDataSize;
        if (bitSize == 7)
        {
            userDataSize = this.intToHex(inpString.length);

            for(let i=0;i<=inpString.length;i++)
            {
                if(i==inpString.length)
                {
                    if (octetSecond != "") // AJA Fix overshoot
                    {
                        output = output + "" + (this.intToHex(this.binToInt(octetSecond)));
                    }
                    break;
                }
                let current = this.intToBin(this.getSevenBit(inpString.charAt(i)),7);
            
                let currentOctet;
                if(i!=0 && i%8!=0)
                {
                    octetFirst = current.substring(7-(i)%8);
                    currentOctet = octetFirst + octetSecond;	//put octet parts together
                
                    output = output + "" + (this.intToHex(this.binToInt(currentOctet)));
                    octetSecond = current.substring(0,7-(i)%8);	//set net second octet
                }
                else
                {
                    octetSecond = current.substring(0,7-(i)%8);
                }	
            }
        }
        else if (bitSize == 8)
        {
            userDataSize = this.intToHex(inpString.length);

            let CurrentByte = 0;
            for(let i=0;i<inpString.length;i++)
            {
                CurrentByte = this.getEightBit(inpString.charCodeAt(i));
                output = output + "" + ( this.ToHex( CurrentByte ) );
            }
        }
        else if (bitSize == 16)
        {
            userDataSize = this.intToHex(inpString.length * 2);

            let myChar=0;
            for(var i=0;i<inpString.length;i++)
            {
                myChar = this.get16Bit( inpString.charCodeAt(i) );
                output = output + "" + ( this.ToHex( (myChar&0xff00)>>8 )) + ( this.ToHex( myChar&0xff ) );
            }
        }
        let header = SMSC_INFO_LENGTH_STR + SMSC_NUMBER_FORMAT + SMSC + firstOctet + REIVER_NUMBER_LENGTH + REIVER_NUMBER_FORMAT  + REIVER_NUMBER +  PROTO_ID + DATA_ENCODING + VALID_PERIOD + userDataSize;

        let PDU = header + output;
        let lenght=(PDU.length/2 - SMSC_LENGTH - 1);
        let AT = "AT+CMGW=" + (PDU.length/2 - SMSC_LENGTH - 1) ; // Add /2 for PDU length AJA - I think the SMSC information should also be excluded
        //CMGW
        //return AT + "\n" + PDU;
        return {length:lenght,pduData:PDU}

    }

    getPDUMetaInfo(inp){
        let PDUString = inp;
        let start = 0;
        
        let SMSC_lengthInfo = parseInt(this.HexToNum(PDUString.substring(0,2)));
       
        let SMSC_info = PDUString.substring(2,2+(SMSC_lengthInfo*2));
        let SMSC_TypeOfAddress = SMSC_info.substring(0,2);
        let SMSC_Number = SMSC_info.substring(2,2+(SMSC_lengthInfo*2));

        if (SMSC_lengthInfo != 0)
        {
            SMSC_Number = this.semiOctetToString(SMSC_Number);
        
            // if the length is odd remove the trailing  F
            if((SMSC_Number.substr(SMSC_Number.length-1,1) == 'F') || (SMSC_Number.substr(SMSC_Number.length-1,1) == 'f'))
            {
                SMSC_Number = SMSC_Number.substring(0,SMSC_Number.length-1);
            }
            if (SMSC_TypeOfAddress == 91)
            {
                SMSC_Number = "+" + SMSC_Number;
            }
        }

        let start_SMSDeleivery = (SMSC_lengthInfo*2)+2;
        start = start_SMSDeleivery;
        let firstOctet_SMSDeliver = PDUString.substr(start,2);
        start = start + 2;
        let Tmp_firstOctet_SMSDeliver=0;
        Tmp_firstOctet_SMSDeliver=parseInt(this.HexToNum(firstOctet_SMSDeliver));
        if ((Tmp_firstOctet_SMSDeliver & 0x03) == 1) // Transmit Message
	    {
            let MessageReference = this.HexToNum(PDUString.substr(start,2));
            start = start + 2;
            let sender_addressLength = parseInt(this.HexToNum(PDUString.substr(start,2)));
            if(sender_addressLength%2 != 0)
            {
                sender_addressLength +=1;
            }
            start = start + 2;
            
            let sender_typeOfAddress = PDUString.substr(start,2);
            start = start + 2

            let sender_number = this.semiOctetToString(PDUString.substring(start,start+sender_addressLength));

            if((sender_number.substr(sender_number.length-1,1) == 'F') || (sender_number.substr(sender_number.length-1,1) == 'f' ))
            {
                sender_number =	sender_number.substring(0,sender_number.length-1);
            }
            if (sender_typeOfAddress == 91)
            {
                sender_number = "+" + sender_number;
            }
                start +=sender_addressLength;

            let tp_PID = PDUString.substr(start,2);
                start +=2;

                var tp_DCS = PDUString.substr(start,2);
                var tp_DCS_desc = this.tpDCSMeaning(tp_DCS);  
                start +=2;

            let ValidityPeriod = parseInt(this.HexToNum(PDUString.substr(start,2)));
                start +=2;
            
            let messageLength = parseInt(this.HexToNum(PDUString.substr(start,2)));
            start += 2;
            
            let bitSize = this.DCS_Bits(tp_DCS);
            let userData = "Undefined format";
            if (bitSize==7)
            {
                userData = this.getUserMessage(PDUString.substr(start,PDUString.length-start),messageLength);
            }
            else if (bitSize==8)
            {
                userData = this.getUserMessage8(PDUString.substr(start,PDUString.length-start),messageLength);
            }
            else if (bitSize==16)
            {
                userData = this.getUserMessage16(PDUString.substr(start,PDUString.length-start),messageLength);
            }
    
            userData = userData.substr(0,messageLength);
            if (bitSize==16)
            {
                messageLength/=2;
            }
    
            //var out =  "SMSC#"+SMSC_Number+"\nSender:"+sender_number+"\nTP_PID:"+tp_PID+"\nTP_DCS:"+tp_DCS+"\nTP_DCS-popis:"+tp_DCS_desc+"\n"+userData+"\nLength:"+messageLength;
            return {smsc:SMSC_Number,sender:sender_number,message:userData,length:messageLength}
        }
        else if((Tmp_firstOctet_SMSDeliver & 0x03) == 0){// Receive Message
            let sender_addressLength =parseInt(this.HexToNum(PDUString.substr(start,2)));
            if(sender_addressLength%2 != 0)
            {
                sender_addressLength +=1;
            }
		    start = start + 2;

            let sender_typeOfAddress = PDUString.substr(start,2);
            start = start + 2

		    let sender_number = this.semiOctetToString(PDUString.substring(start,start+sender_addressLength));
        
            if((sender_number.substr(sender_number.length-1,1) == 'F') || (sender_number.substr(sender_number.length-1,1) == 'f' ))
            {
                sender_number =	sender_number.substring(0,sender_number.length-1);
            }
            if (sender_typeOfAddress == 91)
            {
                sender_number = "+" + sender_number;
            }
            start +=sender_addressLength;

		    let tp_PID = PDUString.substr(start,2);
	        start +=2;

	        let tp_DCS = PDUString.substr(start,2);
	        let tp_DCS_desc = this.tpDCSMeaning(tp_DCS);  
	        start +=2;

		    let timeStamp = this.semiOctetToString(PDUString.substr(start,14));
	
            // get date	
            let year = timeStamp.substring(0,2);
            let month = timeStamp.substring(2,4);
            let day = timeStamp.substring(4,6);
            let hours = timeStamp.substring(6,8);
            let minutes = timeStamp.substring(8,10);
            let seconds = timeStamp.substring(10,12);
	
            timeStamp = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
            start +=14;

        
            let messageLength =parseInt(this.HexToNum(PDUString.substr(start,2)));
	        start += 2;

		    let bitSize = this.DCS_Bits(tp_DCS);
	    	let userData = "Undefined format";
            if (bitSize==7)
            {
                userData = this.getUserMessage(PDUString.substr(start,PDUString.length-start),messageLength);
            }
            else if (bitSize==8)
            {
                userData = this.getUserMessage8(PDUString.substr(start,PDUString.length-start),messageLength);
            }
            else if (bitSize==16)
            {
                userData = this.getUserMessage16(PDUString.substr(start,PDUString.length-start),messageLength);
            }

		    userData = userData.substr(0,messageLength);

            if (bitSize==16)
            {
                messageLength/=2;
            }
	        
            return {smsc:SMSC_Number,sender:sender_number,message:userData,length:messageLength}
        }else{
            return null;
        }
    }

    getUserMessage(input,truelength) // Add truelength AJA
    {
        let byteString = "";
        let octetArray = new Array();
        let restArray = new Array();
        let septetsArray = new Array();
        let s=1;
        let count = 0;
        let matchcount = 0; // AJA
        let smsMessage = "";	
        //Cut the input string into pieces of2 (just get the hex octets)
        for(let i=0;i<input.length;i=i+2)
        {
            let hex = input.substring(i,i+2);
            byteString = byteString + this.intToBin(this.HexToNum(hex),8);
        }

        for(let i=0;i<byteString.length;i=i+8)
        {
            octetArray[count] = byteString.substring(i,i+8);
            restArray[count] = octetArray[count].substring(0,(s%8));
            septetsArray[count] = octetArray[count].substring((s%8),8);
            s++;
            count++;
            if(s == 8)
            {
                s = 1;
            }
        }

        // put the right parts of the array's together to make the sectets
        for(var i=0;i<restArray.length;i++)
        {
            
            if(i%7 == 0)
            {	
                if(i != 0)
                {
                
                    smsMessage = smsMessage + sevenbitdefault[this.binToInt(restArray[i-1])];
                    matchcount ++; // AJA
                }
                smsMessage = smsMessage + sevenbitdefault[this.binToInt(septetsArray[i])];
                matchcount ++; // AJA
            }
            else
            {
                smsMessage = smsMessage +  sevenbitdefault[this.binToInt(septetsArray[i]+restArray[i-1])];
                matchcount ++; // AJA
            }
        
        }
            if(matchcount != truelength) // Don't forget trailing characters!! AJA
            {
                smsMessage = smsMessage + sevenbitdefault[this.binToInt(restArray[i-1])];
            }

        return smsMessage;
    }

    getUserMessage8(input,truelength)
    {
        let smsMessage = "";	
        // Cut the input string into pieces of 2 (just get the hex octets)
        for(var i=0;i<input.length;i=i+2)
        {
            var hex = input.substring(i,i+2);
            smsMessage += "" + String.fromCharCode(parseInt(this.HexToNum(hex)));
        }
        return smsMessage;
    }

    getUserMessage16(input,truelength)
    {
        var smsMessage = "";	

        // Cut the input string into pieces of 4
        for(var i=0;i<input.length;i=i+4)
        {
            var hex1 = input.substring(i,i+2);
            var hex2 = input.substring(i+2,i+4);
            smsMessage += "" + String.fromCharCode(parseInt(this.HexToNum(hex1))*256+parseInt(this.HexToNum(hex2)));
        }
        
        return smsMessage;
    }

}