let express = require('express'),
    router = express.Router();

let logger = require('./logger')


let api = require('./api')
let currencyAPI = require('./currency')

router.get('/parse', (req, res) => {
    api.parseFlats().then(flats => {
        logger.info(`${flats.length} flats parsed over url...`)
        res.send(`${flats.length} flats parsed...`)
    });
})

router.get('/days', (req, res) => {
    let district = req.query.district || false;

    api.getDays(district).then(days => {
        res.json({days})
    });
})

router.get('/flats', (req, res) => {
    let district = req.query.district || false;

    (async() => {
        let lastDay = await api.getLastDay()
        let flats = await api.getFlats(lastDay, district)

        res.json({lastDay, flats})
    })()
})

router.get('/favorites', (req, res) => {
    let userID = req.query.userID;

    (async() => {
        let favorites = await api.getFavorites(userID)

        if (!favorites.length) {
            favorites = []
        }

        res.json({favorites})
    })()
})

router.put('/favorites', (req, res) => {
    let {userID, flatID} = req.body;

    (async() => {
        let isNewFavorite = await api.setFavorite(userID, flatID)

        res.json({isNewFavorite})
    })()
})

router.get('/favorites/flats', (req, res) => {
    let userID = req.query.userID;

    (async() => {
        let lastDay = await api.getLastDay()
        let [flats, favoriteIDs] = await Promise.all([api.getFlats(lastDay), api.getFavoritesFlats(userID)])

        let favorites = flats.filter(flat => favoriteIDs.indexOf(flat.siteID) !== -1)

        res.json({favorites})
    })()
})

router.post('/excel', (req, res) => {
    let flats = req.body.flats
    if (api.saveExcel(flats)) {
        res.json({success: true})
    }
})

router.get('/districts', (req, res) => {
    api.getDistricts().then(districts => {
        res.json({districts})
    })
})

router.post('/district', (req, res) => {
    let title = req.body.title
    let url = req.body.url

    api.saveDistrict(title, url).then(district => {
        if (district) {
            api.parseFlats().then(flats => {
                logger.info(`${flats.length} flats parsed after create district ${district.title}...`)
            })

            res.json({success: true})
        } else {
            res.json({success: false})
        }
    })
})

router.get('/districts/stat', (req, res) => {
    api.getDistrictsStat().then(districts => {
        res.json({districts})
    })
})

router.get('/currency', (req, res) => {
    currencyAPI.getCurrency().then(value => {
        res.json({value})
    })
})

module.exports = router;