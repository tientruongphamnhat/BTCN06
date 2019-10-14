var express = require('express');
var bcrypt = require('bcrypt');
var usermodel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  var saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.password, saltRounds);

  var entity = {
    UserName: req.body.username,
    Email: req.body.email,
    Password: hash
  };

  usermodel.add(entity);
});

router.get('/me', function(req, res, next) {
  res.send(req.user);
});

module.exports = router;
