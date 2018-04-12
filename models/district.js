let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let districtSchema = Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    url: String
});

districtSchema.methods = {

    verifyPassword: function(password) {
        return password == this.password;
    }
};

module.exports = mongoose.model('District', districtSchema);