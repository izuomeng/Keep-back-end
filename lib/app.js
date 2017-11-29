var redis = require('redis'),
  db = redis.createClient();

class App {
  constructor(obj) {
    for (var i in obj) {
      this[i] = obj[i];
    }
  }
  save(fn) {
    var appJSON = JSON.stringify(this);
    db.lpush('app', appJSON, (err) => {
      if (err) {
        return fn(err);
      }
      fn();
    });
  }
  static getAll(name, fn) {
    db.llen('app', (err, total) => {
      db.lrange('app', 0, total, (err, items) => {
        if (err) {
          fn(err);
        }
        var apps = [];
        items.forEach((v) => {
          v = JSON.parse(v);
          if (v.username === name) {
            apps.push(v);
          }
        })
        fn(null, apps);
      })
    })
  }
  static replaceApp(newApp, fn) {
    var repeat = '';
    db.llen('app', (err, total) => {
      db.lrange('app', 0, total, (err, items) => {
        if (err) {
          return fn(err)
        }
        items.forEach(v => {
          var app = JSON.parse(v)
          if (app.username === newApp.username) {
            repeat = v
          }
        })
        newApp = JSON.stringify(newApp)
        db.linsert('app', 'after', repeat, newApp, (err) => {
          if (err) {
            return fn(err)
          }
          db.lrem('app', 1, repeat, (err) => {
            if (err) {
              return fn(err)
            }
            return fn(null)
          })
        })
      })
    })
  }
  static deleteApp(username, fn) {
    var toBeDeleted = ''
    db.llen('app', (err, total) => {
      db.lrange('app', 0, total, (err, items) => {
        if (err) {
          return fn(err)
        }
        items.forEach(v => {
          var app = JSON.parse(v)
          if (app.username === username) {
            toBeDeleted = v
          }
        })
        db.lrem('app', 1, toBeDeleted, (err) => {
          if (err) {
            return fn(err)
          }
          return fn(null)
        })
      })
    })
  }
  static count(fn) {
    db.llen('app', fn);
  }
}

module.exports = App;