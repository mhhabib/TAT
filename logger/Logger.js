require('dotenv').config();
const LoggerConfig=require("./LoggerConfig")

let logger = null;
if (process.env.NODE_ENV === 'development') {
    logger=LoggerConfig.DebugLoggerConfig()
}
else {
    logger=LoggerConfig.ProducttionLoggerConfig()
}
module.exports = logger