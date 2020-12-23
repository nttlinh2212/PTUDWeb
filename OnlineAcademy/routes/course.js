var express = require('express');
var router = express.Router();
var courseModel = require('../models/course')
var categoryModel = require('../models/category')
var userModel = require('../models/user')

/* GET home page. */
router.get('/byCat1/:id', async function(req, res, next) {
    const Cat1ID = +req.params.id;
    const lstCourses = await courseModel.allCoursesByCategory1(Cat1ID);
  res.render('course/byCat1', { title: 'ByCat1', lstCourses, Cat1ID  });
});
router.get('/byCat2/:id', async function(req, res, next) {
    const Cat2ID = +req.params.id;
    const lstCourses = await courseModel.allCoursesByCategory2(Cat2ID);
    res.render('course/byCat2', { title: 'ByCat2', lstCourses,  Cat2ID });
});
router.get('/detail/:id', async function(req, res, next) {
    const CourseID = +req.params.id;
    const course = await courseModel.findACourse(CourseID);
    const lecture = await userModel.findALecture(course.LectureID);
    const feedback = await courseModel.allfeedback(CourseID);
    console.log("course");
    console.log("course");
    console.log("course");
    console.log("course");
    console.log("course");
    console.log(course);
    console.log("lecture");
    console.log("lecture");
    console.log("lecture");
    console.log("lecture");
    console.log("lecture");
    console.log(lecture);
    console.log("feedback");
    console.log("feedback");
    console.log("feedback");
    console.log("feedback");
    console.log("feedback");
    console.log(feedback);
    res.render('course/detail', { title: course.title, course, lecture, feedback });
});
module.exports = router;
