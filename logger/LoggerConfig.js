require('dotenv').config();
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json } = format;
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

const logtail = new Logtail(process.env.SOURCE_TOKEN);

exports.ProducttionLoggerConfig = ()=>{
    return createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            json()
        ),
        defaultMeta: { service: 'api-service' },
        transports: [
          new LogtailTransport(logtail)
        ],
      });
}

exports.DebugLoggerConfig = ()=>{
    return createLogger({
        level: 'debug',
        format: combine(
            timestamp(),
            printf((info)=> `${info.timestamp} [${info.level}] : ${info.message}`)
        ),
        defaultMeta: { service: 'api-service' },
        transports: [
          new transports.Console(),
          new transports.File({ filename: './Logs/error.log', level: 'error' }),
          new transports.File({ filename: './Logs/combined.log' }),
        ],
      });
}

