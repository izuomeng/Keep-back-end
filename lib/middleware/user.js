var User = require('../user');

module.exports = function(req, res, next) {
    var uid = req.session.uid;
    if (!uid) {
        res.send({
            type: 'error',
            message: "Please Login!"
        });
    }
    User.get(uid, function(err, user) {
        if (err) {
            return next(err);
        }
        req.user = user;
        next();
    })
}