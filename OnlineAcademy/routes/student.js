var express = require('express');
const bcrypt = require('bcryptjs');
const { allCoursesByStudent, watchlist, delACourseFromWatchlist, addACourseFromWatchlist } = require('../models/course');
const userModel = require('../models/user');
var router = express.Router();
const { getCurrency, getStar } = require('../utils/helpers');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const student = await userModel.find(req.session.authUser.UserID);
    res.render('account/student/index', { title: 'Update Information', student });
});
router.get('/my-courses', async function(req, res, next) {
    const mycourses = await allCoursesByStudent(req.session.authUser.UserID);
    console.log(mycourses, 'mycourses');
    res.render('account/student/mycourses', { title: 'My Courses', mycourses, getCurrency, getStar });
});
router.get('/my-watch-list', async function(req, res, next) {
    const courses = await watchlist(req.session.authUser.UserID);
    console.log(courses, 'watchlist');
    res.render('account/student/watchlist', { title: 'Watch List', courses, getCurrency, getStar });
});
//'/student/del-course-in-watch-list?CourseID=10
//o day ko lam kieu json ma se link toi trang nay roi trang redirect lai ve trang watchlist
router.get('/del-course-in-watch-list', async function(req, res, next) {
    const CourseID = req.query.CourseID;
    console.log(CourseID);
    await delACourseFromWatchlist(CourseID, req.session.authUser.UserID);
    res.redirect('/student/my-watch-list');
});
//JSOn goi o tat ca cac cho co button click vao add wishlist
//getJSON('/add-course-in-watch-list?CourseID=5')

router.get('/add-course-in-watch-list', async function(req, res, next) {
    const entity = {
        CourseID: req.query.CourseID,
        StudentID: req.session.authUser.UserID
    }
    console.log(entity);
    res.json(await addACourseFromWatchlist(entity));
});
//kieu postJSON '/student/update-info,{full_name:"",email:''},data
router.post('/update-info', async function(req, res, next) {
    const entity = {
        full_name: req.body.full_name,
        UserID: req.session.authUser.UserID,
        email: req.body.email
    }
    console.log(entity);
    res.json(await userModel.update1(entity)); //true ok, false: change email bi trung
});
//postJSON('/student/change-password',{oldpass,newpass})// Js check confirm pass
router.post('/change-password', async function(req, res, next) {
    req.session.authUser = await userModel.find(req.session.authUser.UserID)
    console.log(req.body.oldPassword);
    console.log(req.body.newPassword);
    const ret = bcrypt.compareSync(req.body.oldPassword, req.session.authUser.password);
    console.log(ret);

    if (ret) {
        var Obj = {
                password: bcrypt.hashSync(req.body.newPassword, 10),
                UserID: req.session.authUser.UserID,
            }
            // console.log(Obj);
        var result = await userModel.update(Obj);
        // console.log(result);

        res.json(true); //change pw successfully
    } else {
        res.json(false); //nghia la pass cu nhap ko dung
    }
});

module.exports = router;