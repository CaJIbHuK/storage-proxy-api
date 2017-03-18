import * as winston from "winston";
import * as uuid from "uuid";

export default class Logger extends winston.Logger {

  private id : string;

  constructor(private name : string) {
    super({
      level : process.env.LOG_LEVEL || 'info',
      transports: [
        new (winston.transports.Console)({
          colorize : true,
          timestamp: () => (new Date).toISOString(),
          formatter: (options) => {
            let data = options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' ;
            let message =  options.message || '';
            return `${this.id} | ${this.name} | ${options.timestamp()} [${options.level.toUpperCase()}] ${message} ${data}`;
          },
        })
      ]
    });
    this.id = uuid.v1();
  }

  static getLogger(name : string) : Logger {
    return new Logger(name);
  }

}