module.exports = {
    authStudent(req, res, next) {
        if (req.session.auth === false) {
          req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        if(req.session.authuUser.type_of_account !== 0)
          return res.redirect('/');
        next();
    },
    authLecture(req, res, next) {
        if (req.session.auth === false) {
          req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        if(req.session.authuUser.type_of_account !== 1)
          return res.redirect('/');
        next();
    },
    authAdmin(req, res, next) {
        if (req.session.auth === false) {
          req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        if(req.session.authuUser.type_of_account !== 2)
          return res.redirect('/');
        next();
    }
}
  