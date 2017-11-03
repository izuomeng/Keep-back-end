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
    static count(fn) {
        db.llen('notes', fn);
    }
}

module.exports = Entry;