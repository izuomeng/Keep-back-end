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

router.post('/', function(req, res, next) {
    var data = req.body,
        entry = new Entry({
            username: req.user.name,
            id: data.id,
            title: data.title,
            text: data.text,
            lable: data.lable || '',
            isFixed: data.isFixed || false,
            bgColor: data.bgColor || '#FAFAFA',
            isReminder: data.isReminder || false,
            reminderInfo: data.reminderInfo || {
                date: null,
                repeat: ''
            },
            isDeleted: data.isDeleted || false,
            deleteTime: data.deleteTime || null
        })
    Entry.removeById(data.id, err => {
        if (err) {
            return next(err)
        }
        if (data.title.blocks.length < 2 && !data.title.blocks[0].text 
            && data.text.blocks.length < 2 && !data.text.blocks[0].text) {
            return res.send({
                type: 'info',
                message: 'empty note'
            })
        }
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
    })
});

module.exports = router;