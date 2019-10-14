var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var userModel = require('../models/user.model');

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var ls = new LocalStrategy(
  {
    usernameField: 'signInUserName',
    passwordField: 'signInPassword'
  },
  (signInUserName, signInPassword, done) => {
    userModel
      .singleByUserName(signInUserName)
      .then(rows => {
        if (rows.length === 0) {
          return done(null, false, { message: 'Invalid user name.' });
        }

        var user = rows[0];
        var ret = bcrypt.compareSync(signInPassword, rows[0].Password);
        if (ret) {
          return done(null, user);
        }

        return done(null, false, { message: 'Invalid password.' });
      })
      .catch(err => {
        return done(err, false);
      });
  }
);

passport.use(ls);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret'
    },
    function(jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return userModel
        .single(jwtPayload.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);
