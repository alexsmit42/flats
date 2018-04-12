let express = require('express'),
    router = express.Router();

let logger = require('./logger')


let api = require('./api')

router.get('/parse', (req, res) => {
    api.parseFlats().then(flats => {
        logger.info(`${flats.length} flats parsed over url...`)
        res.send(`${flats.length} flats parsed...`)
    });
})

router.get('/days', (req, res) => {
    api.getDays().then(days => {
        res.json({days})
    });
})

router.get('/flats', (req, res) => {
    (async() => {
        let lastDay = await api.getLastDay()
        let flats = await api.getFlats(lastDay)

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

module.exports = router;