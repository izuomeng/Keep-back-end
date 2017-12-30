var redis = require('redis'),
  db = redis.createClient();

class Entry {
  constructor(obj) {
    for (var i in obj) {
      this[i] = obj[i];
    }
  }
  save(fn) {
    var entryJSON = JSON.stringify(this);
    db.lpush('notes', entryJSON, (err) => {
      if (err) {
        return fn(err);
      }
      fn();
    });
  }
  static getAll(name, fn) {
    db.llen('notes', (err, total) => {
      db.lrange('notes', 0, total, (err, items) => {
        if (err) {
          fn(err);
        }
        var entries = [];
        items.forEach((v) => {
          v = JSON.parse(v);
          if (v.username === name) {
            entries.push(v);
          }
        })
        fn(null, entries);
      })
    })
  }
  static removeById(id, fn) {
    var flag = false,
      repeat = ''
    db.llen('notes', (err, total) => {
      db.lrange('notes', 0, total, (err, items) => {
        if (err) {
          return fn(err)
        }
        items.forEach(v => {
          var note = JSON.parse(v)
          if (note.id === id) {
            flag = true
            repeat = v
          }
        })
        if (!flag) {
          return fn(null)
        }
        db.lrem('notes', 1, repeat, (err) => {
          if (err) {
            return fn(err)
          }
          return fn(null)
        })
      })
    })
  }
  static replaceNote(newNote, fn) {
    var repeat = '';
    db.llen('notes', (err, total) => {
      db.lrange('notes', 0, total, (err, items) => {
        if (err) {
          return fn(err)
        }
        items.forEach(v => {
          var note = JSON.parse(v)
          if (note.id === newNote.id) {
            repeat = v
          }
        })
        newNote = JSON.stringify(newNote)
        db.linsert('notes', 'after', repeat, newNote, (err) => {
          if (err) {
            return fn(err)
          }
          db.lrem('notes', 1, repeat, (err) => {
            if (err) {
              return fn(err)
            }
            return fn(null)
          })
        })
      })
    })
  }
  static replaceNotes(notes, fn) {
    db.llen('notes', (err, total) => {
      db.lrange('notes', 0, total, (err, items) => {
        if (err) {
          return fn(err)
        }
        var finIndex = notes.length - 1
        notes.every((note, index) => {
          var noteInDb = items.find(item => {
            var itemObj = JSON.parse(item)
            return itemObj.id === note.id
          })
          if (noteInDb) {
            var noteInJSON = JSON.stringify(note)
            db.linsert('notes', 'after', noteInDb, noteInJSON, (err) => {
              if (err) {
                return fn(err)
              }
              db.lrem('notes', 1, noteInDb, (err) => {
                if (err) {
                  return fn(err)
                }
                if (index === finIndex) {
                  fn(null)
                }
              })
            })
            return true
          } else {
            fn('error: no id matches during batch update notes')
            return false
          }
        })
      })
    })
  }
  static deleteNote(id, fn) {
    var toBeDeleted = ''
    db.llen('notes', (err, total) => {
      db.lrange('notes', 0, total, (err, items) => {
        if (err) {
          return fn(err)
        }
        items.forEach(v => {
          var note = JSON.parse(v)
          if (note.id === id) {
            toBeDeleted = v
          }
        })
        db.lrem('notes', 1, toBeDeleted, (err) => {
          if (err) {
            return fn(err)
          }
          return fn(null)
        })
      })
    })
  }
  static count(fn) {
    db.llen('notes', fn);
  }
}

module.exports = Entry;