var express = require('express');
var router = express.Router();
var App = require('../lib/app');

router.post('/', function(req, res, next) {
    var data = req.body,
        app = new App({
          username: req.user.name,
          lables: data.lables || []
        })
    App.deleteApp(req.user.name, err => {
        if (err) {
            return next(err)
        }
        app.save(function(err) {
            if (err) {
                res.send({
                    type: 'error',
                    message: 'post app status failed'
                })
                return next(err);
            }
            res.send({
                type: 'info',
                message: 'post app status succeed'
            })
        });
    })
});
router.post('/editApp', function(req, res, next) {
    var data = req.body;
    Entry.replaceNote(data.newApp, (err) => {
        if (err) {
            return next(err)
        }
        res.send({
            type: 'info',
            message: 'edit app succeed'
        })
    })
})

module.exports = router;