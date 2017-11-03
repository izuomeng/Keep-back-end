var express = require('express');
var router = express.Router();
var Entry = require('../lib/entry');

//default router
router.get('/', function(req, res, next) {
    Entry.getAll(req.user.name, function(err, entries) {
        if (err) {
            return next(err);
        }
        res.send(entries);
    });
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