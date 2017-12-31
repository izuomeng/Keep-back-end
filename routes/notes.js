var express = require('express');
var Delta = require('quill-delta')
var router = express.Router();
var Entry = require('../lib/entry');
var App = require('../lib/app');
var multer  = require('multer');

var path = require('path'),
  fs = require('fs'),
  join = path.join,
  upload = multer({dest: 'uploads/'});
  
function isBlank(content) {
  const delta = new Delta(content)
  return delta.length() < 2
}
router.use(function (req, res, next) {
  if (!req.user.name) {
    return res.send({
      type: 'error',
      message: 'not authenticate'
    })
  } else {
    return next()
  }
})
router.get('/', function (req, res, next) {
  Entry
    .getAll(req.user.name, function (err, entries) {
      if (err) {
        return next(err);
      }
      App
        .getAll(req.user.name, function (err, app) {
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
    if (isBlank(data.title) && isBlank(data.text)) {
      return res.send({
        type: 'info',
        message: 'empty note'
      })
    }
    entry
      .save(function (err) {
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
  if (Array.isArray(data.notes)) {
    var notes = data.notes.map(note => {
      note.username = username
      return note
    })
    Entry.replaceNotes(notes, (err) => {
      if (err) {
        return next(err)
      }
      res.send({
        type: 'info',
        message: 'insert notes succeed'
      })
    })
  } else {
    Object.assign(data.newNote, {
      username
    })
    Entry.replaceNote(data.newNote, (err) => {
      if (err) {
        return next(err)
      }
      res.send({
        type: 'info',
        message: 'insert notes succeed'
      })
    })
  }
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
router.post('/upload',upload.single('image'), function(req, res, next) {
  var file = req.file,
    name = file.originalname,
    id = req.body.id
    path = join(__dirname, `../public/images/${name}`);
  fs.rename(file.path, path, function(err) {
    if (err) {
      return next(err);
    }
    res.send({
      type: 'info',
      message: 'upload succeed'
    })
  });
})

module.exports = router;