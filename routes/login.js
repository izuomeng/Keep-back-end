var express = require('express');
var router = express.Router();
var User = require('../lib/user');
var Entry = require('../lib/entry')

router.post('/', function(req, res, next) {
    var data = req.body;
    User.authenticate(data.username, data.userpass, function(err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            req.session.uid = user.id;
            Entry.getAll(user.name, function(err, entries) {
                if (err) {
                    return next(err);
                }
                return res.json({
                    type: 'info',
                    message: `欢迎回来，${user.name}`,
                    notes: entries,
                    username: user.name
                });
            });
        } else {
            return res.json({
                type: 'error',
                message: '用户不存在或密码错误！',
                notes: [],
                username: ''
            });
        }
    });
});

module.exports = router;