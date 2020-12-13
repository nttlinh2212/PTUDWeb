var express = require('express');
var router = express.Router();
var courseModel = require('../models/course')
var categoryModel = require('../models/category')


//Notes: lstCat1: ds cat cap 1,lstCat2: list of list vd nhu list cat2 cua cat1 la: lstCat2[Cat1ID]
// la bien local nen mn co the su dung trong view lun khoi can khai bao
/* GET home page. */
router.get('/', async function(req, res, next) {
  const top4HotCoursesLastWeek = await courseModel.top4HotCoursesLastWeek();
  const top10CoursesByViews =  await courseModel.top10CoursesByViews();
  const top10NewCourses =  await courseModel.top10NewCourses();
  const top4Cat1BuyLastWeek =  await categoryModel.top4Cat1BuyLastWeek();
  res.render('index', { title: 'Home', top4HotCoursesLastWeek,top10CoursesByViews, top10NewCourses, top4Cat1BuyLastWeek});
});

module.exports = router;
