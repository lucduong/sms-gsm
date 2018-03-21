export class Message {
  private _smsContent: string;
  private _phoneNumber: string;
  constructor(message: string, phone: string) {
    this._smsContent = message;
    this._phoneNumber = phone;
  }

  get smsContent():string{
    return this._smsContent;
  }

  get phoneNumber():string{
    return this._phoneNumber;
  }
}
