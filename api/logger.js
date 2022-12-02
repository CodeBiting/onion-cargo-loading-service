var config = require('../config/config.js');
const { createLogger, format, transports } = require("winston");

const level = process.env.LOG_LEVEL || "debug";
 
function formatParams(info) {
  const { timestamp, level, message, ...args } = info;
 
  return `${timestamp} ${level}: ${message} ${Object.keys(args).length
    ? JSON.stringify(args, "", "")
    : ""}`;
}
 
const developmentFormat = format.combine(
  format.colorize(),   // Indiquem que volem colors
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);
 
const productionFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(formatParams),
  format.json()
);
 
let logger;

const transportsCustom = [
  // Allow the use the console to print the messages => PM2 and Docker saves to file
  new transports.Console(),
  // Allow to print all the error level messages inside the error.log file
  //new transports.File({ filename: 'logs/error.log', level: 'error' }),
  // Allow to print all the error message inside the all.log file
  // (also the error log that are also printed inside the error.log(
  //new transports.File({ filename: 'logs/all.log' }),
] 

if (process.env.NODE_ENV !== "production") {
  logger = createLogger({
    level: level,
    format: developmentFormat,
    //transports: [new transports.Console()]
    transports: transportsCustom
  });
 
} else {
  logger = createLogger({
    level: level,
    format: productionFormat,
    // En entorn de producció indiquem el servei i el client
    defaultMeta: {
      service: config.service,
      client: config.client,
    },
    transports: transportsCustom
  });
}
module.exports = logger;
