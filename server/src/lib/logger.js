var winston = require('winston');
require('winston-daily-rotate-file');
var util = require('util');

function formatLog({level, message, timestamp, ...meta}){
    var message = `${timestamp} [${level.toUpperCase()}] => ${message}`
        
    // console.log(options);
    if (meta && Object.keys(meta).length){
        message += `, object: \n ${JSON.stringify(meta, null, 2)}`
    }

    return message;
}

var logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(formatLog)
    ),
    transports: [
        new winston.transports.Console(),
        new (winston.transports.DailyRotateFile)({filename: './Logs/%DATE%.log'})
    ]
})


logger.level = 'debug';

export default logger;