let api = require('./utils/api')
let logger = require('./utils/logger')
let currency = require('./utils/currency')
let CronJob = require('cron').CronJob;

let job = new CronJob({
  cronTime: '00 00 11 * * *',
  onTick: function () {
    api.parseFlats().then(flats => {
      logger.info(`${flats.length} flats parsed over cron...`)
    })

    currency.updateCurrency()
  },
  start: false,
  timeZone: 'Europe/Moscow'
});
job.start();

// api.parseFlats().then(flats => {
//   logger.info(`${flats.length} flats parsed over cron...`)
// })

