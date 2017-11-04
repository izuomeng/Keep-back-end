var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.session.uid = 0;
    res.send({
        type: 'info',
        message: '注销成功'
    });
});