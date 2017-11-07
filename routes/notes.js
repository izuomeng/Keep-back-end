var express = require('express');
var router = express.Router();
var Entry = require('../lib/entry');

router.get('/', function(req, res, next) {
    if (!req.user.name) {
        return res.send({
            type: 'error',
            message: '需要认证！',
            username: null,
            notes: []
        })
    } else {
        Entry.getAll(req.user.name, function(err, entries) {
            if (err) {
                return next(err);
            }
            return res.send({
                type: 'info',
                message: '获取数据成功',
                username: req.user.name,
                notes: entries
            });
        });
    }
});

router.post('/', 
    function(req, res, next) {
        var data = req.body,
            entry = new Entry({
                username: req.user.name,
                // ...data
            })
        entry.save(function(err) {
            if (err) {
                res.send({
                    type: 'error',
                    message: 'upload notes failed'
                })
                return next(err);
            }
            res.send({
                type: 'info',
                message: 'upload notes succeed'
            })
        });
    }
);

module.exports = router;