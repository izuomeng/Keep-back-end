var express = require('express');
var router = express.Router();
var Entry = require('../lib/entry');
var App = require('../lib/app')

router.use(function(req, res, next) {
  if (!req.user.name) {
    return res.send({
      type: 'error',
      message: 'not authenticate',
    })
  } else {
    return next()
  }
})
router.get('/', function (req, res, next) {
    Entry.getAll(req.user.name, function (err, entries) {
      if (err) {
        return next(err);
      }
      App.getAll(req.user.name, function(err, app) {
        if (err) {
          return next(err);
        }
        return res.send({
          type: 'info',
          message: '获取数据成功',
          username: req.user.name,
          notes: entries,
          app
        });
      })
    });
});

router.post('/', function (req, res, next) {
  var data = req.body,
    entry = new Entry({
      username: req.user.name,
      id: data.id,
      title: data.title,
      text: data.text,
      lable: data.lable || [],
      isFixed: data.isFixed || false,
      isArchived: data.isArchived || false,
      bgColor: data.bgColor || '#FAFAFA',
      reminderInfo: data.reminderInfo || {
        date: null,
        repeat: ''
      },
      deleteTime: data.deleteTime || null,
      height: data.height || 134
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
    entry.save(function (err) {
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
router.post('/editNote', function (req, res, next) {
  var data = req.body
  var username = req.user.name
  Object.assign(data.newNote, {username})
  Entry.replaceNote(data.newNote, (err) => {
    if (err) {
      return next(err)
    }
    res.send({
      type: 'info',
      message: 'insert notes succeed'
    })
  })
})
router.post('/deleteNote', function (req, res, next) {
  var data = req.body
  Entry.deleteNote(data.id, (err) => {
    if (err) {
      return next(err)
    }
    res.send({
      type: 'info',
      message: 'delete notes succeed'
    })
  })
})
module.exports = router;