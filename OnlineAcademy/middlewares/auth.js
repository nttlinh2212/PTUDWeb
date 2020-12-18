module.exports = {
    authStudent(req, res, next) {
        if (req.session.auth === false) {
          req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        next();
    },
    authLecture(req, res, next) {
        if (req.session.auth === false) {
          req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        next();
    },
    authAdmin(req, res, next) {
        if (req.session.auth === false) {
          req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        next();
    }
}
  