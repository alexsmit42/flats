let LocalStrategy = require('passport-local').Strategy;

let {User} = require('./models')

module.exports = (app, passport) => {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user)
        });
    });

    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.findOne({username: username}).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                  }
                  if (!user.verifyPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                  }
                  return done(null, user);
            })
        }
    ))
}
