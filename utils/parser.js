let cheerio = require('cheerio')
let request = require('request-promise')

let $ = {};

let parser = {
    getFlats: async (url) => {
        let body = await request(url)
        $ = cheerio.load(body)

        let flats = [];
        let lastPage = $('.mainBox footer a[href]').length
        for (let page = 1; page <= lastPage; ++page) {
            if (page > 1) {
                body = await request(`${url}&page=${page}`)
                $ = cheerio.load(body)
            }

            let pageFlats = $('.mainBox').find('.row[data-id]')
            flats = [...flats, ...pageFlats.map((index, el) => {
                return parser.getFlat($(el))
            }).get()]
        }

        return flats
    },
    getFlat: (flat) => {
        let photo = $('.photo img', flat).attr('data-original')

        let siteID = flat.attr('data-id')
        let title = $('section header h2.location', flat).text()
        let url = $('section header a.property_link', flat).attr('href')
        let price = $('section header .price div', flat).text()
        price = parseInt(price)

        let params = $('section .info-description .param span', flat)
        let rooms = parseInt($('b', params[0]).text())
        let area = parseInt($('b', params[1]).text())

        return {siteID, title, url, photo, rooms, area, price}
    } 
}

module.exports = parser