let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    password: String,
    isAdmin: Boolean,
    regDate: Date,
    social: Object
});

userSchema.methods = {

    verifyPassword: function(password) {
        return password == this.password;
    }
};

module.exports = mongoose.model('User', userSchema);