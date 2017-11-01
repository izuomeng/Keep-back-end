var express = require('express');
var router = express.Router();
var User = require('../lib/user');

router.get('/logout', function(req, res, next) {
    req.session.uid = 0;
    res.send({
        type: 'info',
        message: 'Logout succeed'
    });
});
router.post('/login', function(req, res, next) {
    var data = req.body;
    User.authenticate(data.user_name, data.user_pass, function(err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            req.session.uid = user.id;
            res.send({
                type: 'info',
                message: 'Login Succeed'
            })
        } else {
            res.send({
                type: 'error',
                message: 'Sorry! Invalid credentials'
            });
        }
    });
});

module.exports = router;