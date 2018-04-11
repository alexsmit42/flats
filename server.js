let express = require('express')
let app = express()

let compression = require('compression')
let bodyParser = require('body-parser')

app.use(compression({threshold:0}))
app.use(express.static('dist'))
app.use(express.static('src'))
// app.use(express.static('views'))


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

let router = require('./utils/router')
app.use('/api', router)

app.listen(3000)