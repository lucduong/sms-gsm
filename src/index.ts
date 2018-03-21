
import { GSM } from './GSM';
import { Port } from './Port';

const ports = new Array<Port>();
ports.push(new Port('sim62', '/dev/ttyUSB14',""));
ports.push(new Port('sim61', '/dev/ttyUSB15',""));

const gsm = new GSM(ports);
