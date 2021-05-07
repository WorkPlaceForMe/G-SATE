const fs = require("fs");
const winston = require("winston");

const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const loggerConfig = {
  level: "info",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  format: winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.timestamp({
      format: "DD-MM-YYYY hh:mm:ss A",
    }),
    winston.format.printf((nfo) => {
      return `${nfo.timestamp} - ${nfo.level}: ${nfo.message}`;
    })
  ),
};

let logger = winston.createLogger({
  ...loggerConfig,
  transports: [
    new winston.transports.Console({
      colorize: true,
      timestamp: true,
    }),
    new winston.transports.File({
      filename: `${logDir}/app.log`,
    }),
  ],
});

// Extend logger object to properly log 'Error' types
let origLog = logger.log;

logger.log = function (level, msg) {
  if (msg instanceof Error) {
    let args = Array.prototype.slice.call(arguments);
    args[1] = msg.stack;
    origLog.apply(logger, args);
  } else {
    origLog.apply(logger, arguments);
  }
};

module.exports = logger;

module.exports.stream = {
  write: function (message) {
    logger.info(message);
    // console.log("message = ", message);
  },
};
