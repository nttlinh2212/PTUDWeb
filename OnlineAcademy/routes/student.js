var express = require('express');
const { allCoursesByStudent,  watchlist, delACourseFromWatchlist, addACourseFromWatchlist } = require('../models/course');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('account/student/index', { title: 'Express', layout: false });
});
router.get('/my-courses', async function (req, res, next) {
  const mycourses = await allCoursesByStudent(req.session.authUser.UserID);
  console.log(mycourses,'mycourses');
  res.render('account/student/mycourses', { title: 'My Courses', layout: false, mycourses });
});
router.get('/my-watch-list', async function (req, res, next) {
  const courses = await watchlist(req.session.authUser.UserID);
  console.log(courses,'watchlist');
  res.render('account/student/watchlist', { title: 'Watch List', layout: false, courses });
});
//'/student/del-course-in-watch-list?CourseID=10
//o day ko lam kieu json ma se link toi trang nay roi trang redirect lai ve trang watchlist
router.get('/del-course-in-watch-list', async function (req, res, next) {
  const CourseID = req.query.CourseID;
  console.log(CourseID);
  await delACourseFromWatchlist(CourseID,req.session.authUser.UserID);
  res.redirect('/student/my-watch-list');
});
//JSOn goi o tat ca cac cho co button click vao add wishlist
//getJSON('/add-course-in-watch-list?CourseID=5')
router.get('/add-course-in-watch-list', async function (req, res, next) {
  const entity = {
    CourseID:req.query.CourseID,
    StudentID:req.session.authUser.UserID
  }
  console.log(entity);
  await addACourseFromWatchlist(entity);
  res.json(true);
});
module.exports = router;
