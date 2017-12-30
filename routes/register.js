var express = require('express');
var router = express.Router();
var User = require('../lib/user');

router.post('/', function (req, res, next) {
  var data = {
    name: req.body.username,
    pass: req.body.userpass
  }
  User.getByName(data.name, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user.id) {
      return res.send({
        type: 'error',
        message: '用户名已存在！',
        notes: [],
        username: '',
        app: {}
      });
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });
      user.save(function (err) {
        if (err) {
          return next(err);
        }
        req.session.uid = user.id;
        return res.send({
          type: 'info',
          message: '注册成功',
          notes: [],
          username: data.name,
          app: {}
        });
      });
    }
  });
});

module.exports = router;