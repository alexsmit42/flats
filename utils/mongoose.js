let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/flats').catch(err => {
    console.log(err); 
});

module.exports = mongoose;