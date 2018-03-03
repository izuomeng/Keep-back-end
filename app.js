var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var user = require('./lib/middleware/user')

var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var notes = require('./routes/notes');
var userApp = require('./routes/app')

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'zuomeng',
  cookie: {maxAge: 2.6e9},
  resave: true,
  saveUninitialized: true
}));
app.use(user);

app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/notes', notes);
app.use('/app', userApp)

// error handler
app.use(function(err, req, res, next) {
  if (err) {
    console.log({
      type: 'error',
      message: err.message
    })
    res.send({
      type: 'error'
    })
  }
});


module.exports = app;
