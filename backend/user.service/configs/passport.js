const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/userModel');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret', // Thay đổi thành secret của bạn
};

module.exports = (passport) => {
    passport.use(new Strategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false)
            })
            .catch(err => done(err, false));
    }));
};