export class Message {
  private _smsContent: string;
  private _phoneNumber: string;
  private _time:string;
  constructor(message: string, phone: string) {
    this._smsContent = message;
    this._phoneNumber = phone;
  }

  get smsContent():string{
    return this._smsContent;
  }

  set smsContent(val: string) {
    this._smsContent = val;
  }

  get phoneNumber():string{
    return this._phoneNumber;
  }

  set phoneNumber(val: string) {
    this._phoneNumber = val;
  }

  get time():string{
    return this._time;
  }
  set time(val: string) {
    this.time = val;
  }
}
