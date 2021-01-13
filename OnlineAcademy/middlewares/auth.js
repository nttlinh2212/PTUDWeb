const { checkAStudenntParticipatingCourse } = require("../models/course");
const lession = require("../models/lession");
const { findALession } = require("../models/lession");

module.exports = {
    authStudent(req, res, next) {
        if (req.session.auth === false) {
          if(req.originalUrl === '/cart/checkout')
            req.session.retUrl = '/cart';
          else
            req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        if(req.session.authUser.type_of_account !== 0)
          return res.redirect('/');
        next();
    },
    authLecture(req, res, next) {
        if (req.session.auth === false) {
          req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        if(req.session.authUser.type_of_account !== 1)
          return res.redirect('/');
        next();
    },
    authAdmin(req, res, next) {
        if (req.session.auth === false) {
          req.session.retUrl = req.originalUrl;
          return res.redirect('/account/login');
        }
        if(req.session.authUser.type_of_account !== 2)
          return res.redirect('/');
        next();
    },
    async authVideo(req, res, next) {
      const CourseID = +req.params.courseid;
      const LessionID = +req.params.lessionid.slice(0,-4);
      console.log(CourseID, LessionID);
      const lession = await findALession(LessionID);
      console.log(lession);
      if(lession.preview===1){
        console.log("preview = 0");
        next();
        return;
      }
        
      if (req.session.auth === false) {
        req.session.retUrl = req.headers.referer;
        return res.redirect('/account/login');
      }
      // if(req.session.authUser.type_of_account !== 0)
      //   return res.redirect('/');
      //console.log(await checkAStudenntParticipatingCourse(CourseID,req.session.authUser.UserID));
      if(await checkAStudenntParticipatingCourse(CourseID,req.session.authUser.UserID)===null)
        return  res.redirect(req.headers.referer || '/');
      next();
  }
}
  