let mongoose = require('./mongoose');
let {Flat, District} = require('../models')
let redis = require('./redis')

let parser = require('./parser')

let xlsx = require('xlsx')

let getMedian = function(arr) {
    arr = arr.sort()
    let length = arr.length
    let median = 0;
    if (length % 2 === 0) {
        let centerIndex = length / 2
        median = (arr[centerIndex] + arr[centerIndex + 1]) / 2
    } else {
        let centerIndex = (length + 1) / 2
        median = arr[centerIndex]
    }

    return Math.round(median * 10) / 10
}

let api = {
    parseFlats: async () => {
        let districts = await api.getDistricts()

        let flats = await Promise.all(districts.map(district => {
            return parser.getFlats(district)
        }))
        flats = [].concat.apply([], flats)

        return api.saveFlats(flats)
    },

    saveFlats: (flats) => {
        return new Promise ((resolve) => {
            flats.map((flat) => {
                if (flat.price < 700) {
                    return
                }

                api.saveFlat(flat).then(dbFlat => {
                    redis.saveFlat(dbFlat)
                })
            })

            resolve(flats)
        });
    },

    saveFlat: (flat) => {
        return new Promise ((resolve) => {
            Flat.findOne({siteID: flat.siteID}).then(dbFlat => {
                if (!dbFlat) {
                    flat['_id'] = new mongoose.Types.ObjectId()
    
                    Flat.create(flat).then(newFlat => {
                        resolve(newFlat)
                    })
                } else {
                    resolve(dbFlat)
                }
            })
        })
    },

    getDays: async (district = false) => {
        let keys = await redis.getDaysKeys()
        let days = {};

        let flatKeys = keys.reduce( (flatKeys, key) => {
            let regexp = /days:(.+):(.+)$/g
            let format = regexp.exec(key)
            let day = format[1] || 0
            let flatID = format[2] || 0

            if (flatKeys[flatID] === undefined) {
                flatKeys[flatID] = []
            }

            // days when published flat
            flatKeys[flatID].push({key, day})

            return flatKeys
        }, {})

        let flats = await api.getDBFlats(Object.keys(flatKeys), district)
        
        await Promise.all(
            flats.map(async (flat) => {
                await Promise.all(flatKeys[flat.siteID].map(async (flatKey) => {
                    let day = flatKey.day
                    let key = flatKey.key

                    let price = await redis.getPrice(key)
                    if (!flat) {
                        return
                    }

                    let meter = Math.round(price / flat.area * 10) / 10;

                    if (days[day] === undefined) {
                        days[day] = []
                    }

                    days[day].push({
                        meter, 
                        flatID: flat.siteID, 
                        price: parseInt(price),
                        area: flat.area, 
                        rooms: flat.rooms
                    })
                }))
            })
        );

        return days
    },

    getFlat: async (flatID) => {
        let flat = await Flat.findOne({siteID: flatID})
        return flat
    },

    getDBFlats: async (flatIDs, district) => {
        let condition = {
            siteID: {$in: flatIDs}
        }

        if (district) {
            condition['district'] = district
        }

        let flats = await Flat.find(condition)
        return flats
    },

    getLastDay: async() => {
        let lastDay = await redis.getLastDay()
        return lastDay
    },

    getFlats: async (day, district = false) => {
        let keys = await redis.getDaysKeys(day)

        let flatKeys = keys.reduce( (flatKeys, key) => {
            let regexp = /days:(.+):(.+)$/g
            let format = regexp.exec(key)
            let flatID = format[2] || 0

            flatKeys[flatID] = key

            return flatKeys
        }, {})

        let flats = await api.getDBFlats(Object.keys(flatKeys), district)

        return await Promise.all(
            flats.map(async (flat) => {
                let [price, history] = await Promise.all([redis.getPrice(flatKeys[flat.siteID]), redis.getFlatHistory(flat.siteID)])
                let days = Object.keys(history).length
                let uniquePrices = Object.values(history).reduce((prices, price) =>{
                    if (prices.indexOf(price) === -1) {
                        prices.push(price)
                    }

                    return prices
                }, [])

                let meter = Math.round(price / flat.area * 10) / 10;

                return {
                    meter,
                    price,
                    history,
                    days,
                    uniquePrices,
                    title: flat.title,
                    url: flat.url,
                    photo: flat.photo,
                    area: flat.area,
                    rooms: flat.rooms,
                    siteID: flat.siteID,
                    district: flat.district
                }
            })
        )
    },

    getFavorites: async (userID) => {
        return redis.getFavorites(userID)
    },

    setFavorite: async (userID, flatID) => {
        return redis.setFavorite(userID, flatID)
    },

    getFavoritesFlats: async (userID) => {
        let favorites = await redis.getFavorites(userID)
        return favorites
    },

    saveExcel(flats) {
        let filename = './files/flats.xlsx'
        let wsName = 'Flats'

        let titles = ['title', 'rooms', 'price, zł', 'area, m²', 'meter, zł/m²']
        let data = flats.map(flat => {
            return [flat.title, flat.rooms, flat.price, flat.area, flat.meter]
        })

        data.unshift(titles)

        let wb = xlsx.utils.book_new()
        let ws = xlsx.utils.aoa_to_sheet(data)
        
        for (let i in ws) {
            let index = parseInt(i.slice(1))

            // if (index === 1) {
            //     ws[i]['s'] = {
            //         font: {bold: true, name: 'Arial'},
            //         alignment: {horizontal: 'center'}
            //     }
            // }

            if (i[0] === 'A' && index !== 1) {
                ws[i]['l'] = {
                    Target: flats[index - 2].url,
                    Tooltip: flats[index - 2].title
                }
            }
        }

        xlsx.utils.book_append_sheet(wb, ws, wsName)
        xlsx.writeFile(wb, filename)

        return true
    },

    getDistricts() {
        return District.find({})
    },

    saveDistrict(title, url) {
        return District.create({
            _id: new mongoose.Types.ObjectId(),
            title,
            url
        })
    },

    getDistrictsStat: async() => {
        let [districts, lastDay] = await Promise.all([api.getDistricts(), redis.getLastDay()]) 
        let flats = await api.getFlats(lastDay)

        let districtsStat = {}
        flats.map(flat => {
            let districtID = flat.district

            if (districtsStat[districtID] === undefined) {
                districtsStat[districtID] = {
                    total: 0,
                    prices: [],
                    meter: 0,
                    area: 0,
                    rooms: {
                        1: 0,
                        2: 0
                    }
                }
            }

            districtsStat[districtID].total++;
            districtsStat[districtID].meter += Math.round(flat.price / flat.area * 10) / 10;
            districtsStat[districtID].rooms[flat.rooms]++;
            districtsStat[districtID].prices.push(parseInt(flat.price));
            districtsStat[districtID].area += flat.area;
        })

        districts = districts.map(district => {
            let stat = districtsStat[district._id]

            if (stat === undefined) {
                return false
            }
            
            let pricesSum = stat.prices.reduce((sum, price) => {
                return sum + price
            }, 0)

            let avgPrice = Math.round(pricesSum / stat.total)
            let avgMeter = Math.round(stat.meter / stat.total * 100) / 100
            let avgArea = Math.round(stat.area / stat.total * 10) / 10
            let medianPrice = getMedian(stat.prices)
            
            return {
                _id: district._id,
                title: district.title,
                url: district.url,
                avgPrice,
                avgMeter,
                avgArea,
                medianPrice,
                rooms: stat.rooms,
                total: stat.total
            }
        })

        return districts.filter(district => district)
    }
}

module.exports = api;