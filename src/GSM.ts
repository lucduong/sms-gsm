import * as SerialPort from 'serialport';
import { EventEmitter } from 'events';
import { Port } from './Port';

export class GSM extends EventEmitter {
  private queue: Array<any>;
  private partials: Map<String, any>;
  private ports: Map<String, SerialPort>;

  constructor(ports: Array<Port>) {
    super();

    this.queue = [];
    this.partials = new Map<String, any>();
    this.ports = new Map<String, SerialPort>();
    ports.forEach(p => {
      this.ports.set(p.name, this.createNewSerialPort(p.port));
    });
  }

  createNewSerialPort(port: String): SerialPort {
    return new SerialPort(`${port}`, {
      baudRate: 115200,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      rtscts: true,
      autoOpen: false,
    });
  }

  open(): void {
    const portNames: IterableIterator<String> = this.ports.keys();
    for (const portNm in portNames) {
      
    }
  }

  async execute() {
    console.log(this.ports);
  }
}
