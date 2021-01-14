var express = require('express');
const { checkAStudenntParticipatingCourse, checkCourseByLecturer } = require('../models/course');
var router = express.Router();
var courseModel = require('../models/course');
const { findALessionHistory, updateALessionHistory, findALession, updateLastLession, getLastLession, getPercentageCompleting } = require('../models/lession');
var lessionModel = require('../models/lession')
var userModel = require('../models/user')
const { getCurrency, getStar, getDayLeft, getSecond, getTotalRatings } = require('../utils/helpers');
const moment = require('moment');
var findCourseModel = require('../models/findCourse');


const totalItemsPerPage = 3;
const numberOfPageShowing = 3;


router.get('/byCat1/:id/:currentPage', async function (req, res, next) {
    const Cat1ID = +req.params.id;
    var lstCourses = await courseModel.allCoursesByCategory1(Cat1ID);
    var numberOfPage = lstCourses.length / totalItemsPerPage;

    if (numberOfPage - Math.trunc(numberOfPage) > 0) {
        numberOfPage = Math.trunc(numberOfPage) + 1;
    } else {
        numberOfPage = Math.trunc(numberOfPage);
    }

    const path = `/course/byCat1/` + Cat1ID + `/`;
    var currentPage = parseInt(req.params.currentPage);
    if (currentPage >= 1 && currentPage <= numberOfPage) {
        lstCourses = lstCourses.slice((currentPage - 1) * totalItemsPerPage, (currentPage - 1) * totalItemsPerPage + totalItemsPerPage);
        res.render('course/byCat1', {
            title: 'ByCat1',
            lstCourses,
            Cat1ID,
            getCurrency,
            getStar,
            getDayLeft,
            numberOfPage,
            currentPage,
            path,
            numberOfPageShowing
        });
    } else {
        lstCourses = lstCourses.slice(0, totalItemsPerPage);
        res.render('course/byCat1', {
            title: 'ByCat1',
            lstCourses,
            Cat1ID,
            getCurrency,
            getStar,
            getDayLeft,
            numberOfPage,
            currentPage: 1,
            path,
            numberOfPageShowing
        });
    }
});


router.get('/byCat1/:id/', async function (req, res, next) {
    const Cat1ID = +req.params.id;
    var lstCourses = await courseModel.allCoursesByCategory1(Cat1ID);
    var numberOfPage = lstCourses.length / totalItemsPerPage;

    if (numberOfPage - Math.trunc(numberOfPage) > 0) {
        numberOfPage = Math.trunc(numberOfPage) + 1;
    } else {
        numberOfPage = Math.trunc(numberOfPage);
    }

    const path = `/course/byCat1/` + Cat1ID + `/`;
    lstCourses = lstCourses.slice(0, totalItemsPerPage);
    res.render('course/byCat1', {
        title: 'ByCat1',
        lstCourses,
        Cat1ID,
        getCurrency,
        getStar,
        getDayLeft,
        numberOfPage,
        currentPage: 1,
        path,
        numberOfPageShowing
    });
});



router.get('/byCat2/:id/:currentPage', async function (req, res, next) {
    const Cat2ID = +req.params.id;
    var lstCourses = await courseModel.allCoursesByCategory2(Cat2ID);
    var numberOfPage = lstCourses.length / totalItemsPerPage;

    if (numberOfPage - Math.trunc(numberOfPage) > 0) {
        numberOfPage = Math.trunc(numberOfPage) + 1;
    } else {
        numberOfPage = Math.trunc(numberOfPage);
    }

    const path = `/course/byCat2/` + Cat2ID + `/`;
    var currentPage = parseInt(req.params.currentPage);
    if (currentPage >= 1 && currentPage <= numberOfPage) {
        lstCourses = lstCourses.slice((currentPage - 1) * totalItemsPerPage, (currentPage - 1) * totalItemsPerPage + totalItemsPerPage);
        res.render('course/byCat2', {
            title: 'ByCat2',
            lstCourses,
            Cat2ID,
            getCurrency,
            getStar,
            getDayLeft,
            numberOfPage,
            currentPage,
            path,
            numberOfPageShowing
        });
    } else {
        lstCourses = lstCourses.slice(0, totalItemsPerPage);
        res.render('course/byCat2', {
            title: 'ByCat2',
            lstCourses,
            Cat2ID,
            getCurrency,
            getStar,
            getDayLeft,
            numberOfPage,
            currentPage: 1,
            path,
            numberOfPageShowing
        });
    }

});


router.get('/byCat2/:id', async function (req, res, next) {
    const Cat2ID = +req.params.id;
    var lstCourses = await courseModel.allCoursesByCategory2(Cat2ID);
    var numberOfPage = lstCourses.length / totalItemsPerPage;

    if (numberOfPage - Math.trunc(numberOfPage) > 0) {
        numberOfPage = Math.trunc(numberOfPage) + 1;
    } else {
        numberOfPage = Math.trunc(numberOfPage);
    }

    const path = `/course/byCat2/` + Cat2ID + `/`;

    lstCourses = lstCourses.slice(0, totalItemsPerPage);
    res.render('course/byCat2', {
        title: 'ByCat2',
        lstCourses,
        Cat2ID,
        getCurrency,
        getStar,
        getDayLeft,
        numberOfPage,
        currentPage: 1,
        path,
        numberOfPageShowing
    });

});


router.get('/detail/:id', async function (req, res, next) {

    const CourseID = +req.params.id;

    courseModel.updateViews(CourseID);
    const top5courses = await courseModel.top5TheSameCategory1CoursesBuy(CourseID);
    const course = await courseModel.findACourse(CourseID);
    if (course === null)
        res.redirect('/');
    const lecture = await userModel.findALecture(course.LectureID);
    console.log(lecture);
    const feedback = await courseModel.allfeedback(CourseID);
    const lessions = await lessionModel.allLessonsAndSections(CourseID);
    var check = null;
    if(req.session.auth === true)
        var check = await checkAStudenntParticipatingCourse(CourseID, req.session.authUser.UserID);
    //console.log(check.star,'check..');
    if (req.session.auth === true && check !== null) {
        const lastlession = await getLastLession(CourseID, req.session.authUser.UserID);
        const percentage = await getPercentageCompleting(CourseID, req.session.authUser.UserID);
        res.render('course/detail1', { layout: false, title: course.title, course, lecture, feedback, getCurrency, getStar, getDayLeft, top5courses, lessions, lastlession, percentage, type: 0, check,getTotalRatings });

    } else if (req.session.auth === true && await checkCourseByLecturer(req.session.authUser.UserID, CourseID) !== null) {
        //const lastlession = await getLastLession(CourseID, req.session.authUser.UserID);
        //const percentage = await getPercentageCompleting(CourseID, req.session.authUser.UserID);
        res.render('course/detail1', { layout: false, title: course.title, course, lecture, feedback, getCurrency, getStar, getDayLeft, top5courses, lessions, type: 1, percentage: 0 ,getTotalRatings,check});

    } else if (req.session.auth === true && +req.session.authUser.type_of_account === 2) {
        //const lastlession = await getLastLession(CourseID, req.session.authUser.UserID);
        //const percentage = await getPercentageCompleting(CourseID, req.session.authUser.UserID);
        res.render('course/detail1', { layout: false, title: course.title, course, lecture, feedback, getCurrency, getStar, getDayLeft, getTotalRatings,top5courses, lessions, type: 2, percentage: 0 ,check});

    }
    else
        res.render('course/detail', { layout: false, title: course.title, course, lecture, feedback, getCurrency, getStar, getDayLeft, getTotalRatings, top5courses, lessions, isStudent: req.session.auth });
});

router.get('/get-last-point-time', async function (req, res, next) {
    const LessionID = req.query.lessionid;
    console.log(LessionID);
    const history = await findALessionHistory(LessionID, req.session.authUser.UserID);
    console.log('history', history);
    if (history !== null)
        return res.json(history.last_point);
    else
        return res.json(0);

});
router.get('/get-feed-back', async function (req, res, next) {
    console.log(req.query);

    const feedback = {
        StudentID: req.session.authUser.UserID,
        CourseID: req.query.CourseID,
        star: req.query.star,
        review: req.query.comment,
        date_review: moment().format('YYYY-MM-DD HH:mm:ss'),
    }

    console.log(feedback);
    

    const result = await findCourseModel.updateParticipating(feedback);//lun true
    switch (+req.query.star) {
        case 1:
            await courseModel.updateStar1(req.query.CourseID);
            break;
        case 2:
            await courseModel.updateStar2(req.query.CourseID);
            break;
        case 3:
            await courseModel.updateStar3(req.query.CourseID);
            break;
        case 4:
            await courseModel.updateStar4(req.query.CourseID);
            break;
        case 5:
            await courseModel.updateStar5(req.query.CourseID);
            break;
        default:
            break;
        
    }   
    res.json({ result: "true" });
});



//update-last-point-time?lessionid=1&lastpoint=78
router.get('/update-last-point-time', async function (req, res, next) {
    console.log(req.query);
    entity = {
        lessionid: req.query.lessionid,
        studentid: req.session.authUser.UserID,
        last_point: req.query.lastpoint
    }
    const lession = await findALession(entity.lessionid);
    if (lession === null)
        return (null);

    const duration = getSecond(lession.duration);
    const percentage = entity.last_point / duration;
    //console.log('percentage:',percentage,'duration',duration);
    if (percentage >= 0.8)
        entity.done = 1;
    else
        entity.done = 0;
    const history = await findALessionHistory(entity.lessionid, entity.studentid);
    if (history !== null && history.done === 1)
        entity.done = 1;
    return res.json(await updateALessionHistory(entity));

});
//update-last-watch-lession?lessionid=&courseid
router.get('/update-last-watch-lession', async function (req, res, next) {
    const { lessionid, courseid } = req.query;
    //console.log(req.query);   
    return res.json(await updateLastLession(lessionid, courseid, req.session.authUser.UserID));

});

module.exports = router;