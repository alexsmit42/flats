let redis = require('redis');
let bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let moment = require('moment')

let redisClient = redis.createClient({db: 3})

let redisUtils = {
    saveFlat: (flat) => {
        let curDate = moment().format('YYYY-MM-DD')

        redisClient.multi()
            .set(`days:${curDate}:${flat.siteID}`, flat.price, 'NX')
            .hset(`flats:${flat.siteID}`, curDate, flat.price)
            .exec()
    },
    getDaysKeys: async (day = false) => {
        let keyValue = 'days:*';

        if (day) {
            keyValue = `days:${day}:*`
        }

        let keys = await redisClient.keysAsync(keyValue)
        return keys;
    },
    getPrice: async (key) => {
        let price = await redisClient.getAsync(key)
        return price;
    },
    getLastDay: async () => {
        let keys = await redisUtils.getDaysKeys()
        let lastKey = keys.sort().pop()
        let regexp = /days:(.+):(.+)$/g
        let format = regexp.exec(lastKey)
        let day = format[1] || 0

        return day
    },
    getFlatHistory: async (flatID) => {
        let history = await redisClient.hgetallAsync(`flats:${flatID}`)
        return history
    },

    getFavorites: async (userID) => {
        let favorites = await redisClient.smembersAsync(`favorites:${userID}`)
        return favorites
    },

    setFavorite: async (userID, flatID) => {
        let key = `favorites:${userID}`

        let existFavorite = await redisClient.saddAsync(key, flatID)

        if (!existFavorite) {
            redisClient.sremAsync(key, flatID)
            return false
        }

        return true
    }
}

module.exports = redisUtils