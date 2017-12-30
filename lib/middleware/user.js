var User = require('../user');

module.exports = function (req, res, next) {
  var uid = req.session.uid;
  if (!uid) {
    req.user = {}
    return next();
  }
  User.get(uid, function (err, user) {
    if (err) {
      return next(err);
    }
    req.user = user;
    return next();
  })
}