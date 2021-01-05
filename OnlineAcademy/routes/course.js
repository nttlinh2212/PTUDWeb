var express = require('express');
var router = express.Router();
var courseModel = require('../models/course')
var categoryModel = require('../models/category')
var userModel = require('../models/user')
const { getCurrency, getStar } = require('../utils/helpers');


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
            numberOfPage,
            currentPage,
            path,
            numberOfPageShowing
        });
    }
    else {
        lstCourses = lstCourses.slice(0, totalItemsPerPage);
        res.render('course/byCat1', {
            title: 'ByCat1',
            lstCourses,
            Cat1ID,
            getCurrency,
            getStar,
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
            numberOfPage,
            currentPage,
            path,
            numberOfPageShowing
        });
    }
    else {
        lstCourses = lstCourses.slice(0, totalItemsPerPage);
        res.render('course/byCat2', {
            title: 'ByCat2',
            lstCourses,
            Cat2ID,
            getCurrency,
            getStar,
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
    const lecture = await userModel.findALecture(course.LectureID);
    const feedback = await courseModel.allfeedback(CourseID);
    console.log("top5samcourses: ",top5courses);
    res.render('course/detail', { title: course.title, course, lecture, feedback, getCurrency, getStar, top5courses });
});

module.exports = router;
