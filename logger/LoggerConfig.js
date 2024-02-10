const { json } = require('body-parser');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

exports.ProducttionLoggerConfig = ()=>{
    return createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            printf((info)=> `${info.timestamp} [${info.level}] : ${info.message}`)
        ),
        defaultMeta: { service: 'api-service' },
        transports: [
          new transports.Console(),
          new transports.File({ filename: './Logs/error.log', level: 'error' }),
          new transports.File({ filename: '.Logs/combined.log' }),
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

