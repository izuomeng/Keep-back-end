var express = require('express');
var router = express.Router();
var User = require('../lib/user');
var Entry = require('../lib/entry')

router.get('/logout', function(req, res, next) {
    req.session.uid = 0;
    res.send({
        type: 'info',
        message: '注销成功'
    });
});
router.post('/login', function(req, res, next) {
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
                res.send({
                    type: 'info',
                    message: '登陆成功',
                    notes: entries
                });
            });
        } else {
            res.send({
                type: 'error',
                message: '用户不存在或密码错误！'
            });
        }
    });
});

module.exports = router;