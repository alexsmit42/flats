let express = require('express')
let app = express()
let path = require('path')

let compression = require('compression')
let bodyParser = require('body-parser')
let favicon = require('serve-favicon')
let helmet = require('helmet')

app.use(helmet())

app.use(compression({threshold:0}))

app.use(express.static('dist'))
app.use(express.static('src'))
// app.use(express.static('views'))

app.use(favicon(path.join(__dirname, 'src', 'assets', 'favicon.ico')))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/download', (req, res) => {
    var file = __dirname + '/files/flats.xlsx';
    res.download(file);    
})

let router = require('./utils/router')
app.use('/api', router)

app.listen(3000)