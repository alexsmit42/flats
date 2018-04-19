let axios = require('axios')
let redis = require('./redis')

let currencyAPI = {
    updateCurrency() {
        axios.get('https://www.cbr-xml-daily.ru/daily_json.js').then(res => {
            let ruble = res.data.Valute.PLN.Value

            redis.saveCurrency(ruble)
        })
    },

    getCurrency: () => {
        return redis.getCurrency()
    }
}

module.exports = currencyAPI