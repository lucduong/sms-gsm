export class Message{
    private _message:string;
    private _phoneNumber:string;
    constructor(message:string,phoneNumber){
        this._message=message;
        this._phoneNumber=phoneNumber;
    }

    get message():string{
        return this._message;
    }

    set message(val:string){
        this._message=val;
    }

    get phoneNumber():string{
        return this._phoneNumber;
    }

    set phoneNumber(val:string){
        this._message=val;
    }
}