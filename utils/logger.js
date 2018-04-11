let path = require('path');
let moment = require('moment');
const { createLogger, format, transports } = require('winston');
const { combine, printf } = format;

const myFormat = printf(info => {
    const date = new Date();

    let options = {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };

    let formatDate = moment().format('MMMM Do YYYY, h:mm:ss a')

    return `${formatDate} [${info.level}]: ${info.message}`;
});

const logger = createLogger({
    format: combine(
        myFormat
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, '../logs/info.log'), level: 'info' }),
        new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' })
    ]
});

module.exports = logger;