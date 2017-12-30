var redis = require('redis'),
  bcrypt = require('bcrypt'),
  db = redis.createClient();

class User {
  constructor(obj) {
    for (var i in obj) {
      this[i] = obj[i];
    }
  }
  save(fn) {
    if (this.id) {
      this.update(fn);
    } else {
      db.incr('keep_user:ids', (err, id) => {
        if (err) {
          return fn(err);
        }
        this.id = id;
        this.hashPassword((err) => {
          if (err) {
            return fn(err);
          }
          this.update(fn);
        })
      });

    }
  }
  update(fn) {
    var id = this.id;
    db.set(`keep_user:id:${this.name}`, id, (err) => {
      if (err) {
        return fn(err);
      }
      db.hmset(`keep_user:${id}`, this, (err) => {
        fn(err);
      });
    })
  }
  hashPassword(fn) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        return fn(err);
      }
      this.salt = salt;
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) {
          return fn(err);
        }
        this.pass = hash;
        fn();
      });
    });
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
  static get(id, fn) {
    db.hgetall(`keep_user:${id}`, (err, user) => {
      if (err) {
        return fn(err);
      }
      fn(null, new User(user));
    });
  }
  static getId(name, fn) {
    db.get(`keep_user:id:${name}`, fn);
  }
  static getByName(name, fn) {
    this.getId(name, (err, id) => {
      if (err) {
        return fn(err);
      }
      this.get(id, fn);
    });
  }
  static authenticate(name, pass, fn) {
    this.getByName(name, (err, user) => {
      if (err) {
        return fn(err);
      }
      if (!user.id) {
        return fn();
      }
      bcrypt.hash(pass, user.salt, (err, hash) => {
        if (err) {
          return fn(err);
        }
        if (hash === user.pass) {
          return fn(null, user);
        }
        fn();
      });
    });
  }
}

module.exports = User;