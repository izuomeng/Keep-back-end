var express = require('express');
var router = express.Router();
var User = require('../lib/user');

router.post('/', function(req, res, next) {
    var data = {
        name: req.body.user_name,
        pass: req.body.user_pass
    }
    User.getByName(data.name, function(err, user) {
        if (err) {
            return next(err);
        }
        if (user.id) {
            res.send({
                type: 'error',
                message: 'Username already taken!'
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
                    message: 'Register succeed!'
                });
            });
        }
    });
});

module.exports = router;