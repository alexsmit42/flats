let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let districtSchema = Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    url: String
});

module.exports = mongoose.model('District', districtSchema);