let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let flatSchema = Schema({
    _id: Schema.Types.ObjectId,
    siteID: String,
    title: String,
    url: String,
    photo: String,
    area: Number,
    price: Number,
    rooms: Number,
});

module.exports = mongoose.model('Flat', flatSchema);