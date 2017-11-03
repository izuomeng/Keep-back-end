var express = require('express');
var router = express.Router();
var User = require('../lib/user');

router.post('/', function(req, res, next) {
    var data = {
        name: req.body.username,
        pass: req.body.userpass
    }
    User.getByName(data.name, function(err, user) {
        if (err) {
            return next(err);
        }
        if (user.id) {
            res.send({
                type: 'error',
                message: '用户名已存在！'
            });
        } else {
            user = new User({
                name: data.name,
                pass: data.pass
            });
            user.save(function(err) {
                if (err) {
                    return next(err);
                }
                req.session.uid = user.id;
                res.send({
                    type: 'info',
                    message: '注册成功',
                    notes: []
                });
            });
        }
    });
});

module.exports = router;