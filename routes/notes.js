var express = require('express');
var router = express.Router();
var Entry = require('../lib/entry');

router.get('/', function(req, res, next) {
    if (!req.user.name) {
        return res.send({
            type: 'error',
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
                username: req.user.name
            })
        entry.save(function(err) {
            if (err) {
                return next(err);
            }
        });
    }
);

module.exports = router;