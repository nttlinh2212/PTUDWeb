const express = require('express');
const courseModel = require('../../models/course');
const { update, allCoursesByCatAndLecturer } = require('../../models/findCourse');
const router = express.Router();
const categoryModel = require('../../models/category');
const userModel = require('../../models/user');


function getAllStuOrLecOrAd(userList, classify) {
  var resultList = [];

  userList.forEach(function (item) {
    if (item.type_of_account === classify) {
      resultList.push(item);
    }
  })
  console.log(resultList);
  return resultList;
}



router.get('/', async function (req, res) {
  res.render('account/admin/course/index', {
    title: "Admin-Course",
    layout: false
  });
})


router.get('/get-courses-cat1-lecturer', async function (req, res) {
  const listCourses = await courseModel.all();
  const listCat1 = await categoryModel.allCat1();
  const list = await userModel.allStuAndLecturer();
  var lecturerList = getAllStuOrLecOrAd(list, 1);


  // console.log(listCourses);
  // listCourses.forEach(function(item){
  //   console.log("______________");
  //   console.log(item.CourseID + "-" + item.disable + "-" + item.title);
  // })
  res.json({ listCourses, listCat1, lecturerList });
})


router.get('/delete-course', async function (req, res, next) {
  console.log(req.query);
  const CourseID = req.query.CourseID;
  console.log(CourseID);
  const result = await courseModel.del(CourseID);
  console.log(result);
  if (result) {
    res.json({ result: "true" });
  }
  else {
    res.json({ result: "false" });
  }
});
router.get('/disable-course', async function (req, res, next) {
  console.log(req.query);
  const CourseID = req.query.CourseID;
  const course = {
    CourseID,
    disable: 1,
  }
  const result = await update(course);
  res.json(true);
});
router.get('/enable-course', async function (req, res, next) {
  console.log(req.query);
  const CourseID = req.query.CourseID;
  const course = {
    CourseID,
    disable: 0,
  }
  const result = await update(course);
  res.json(true);//lun lun true
});

router.get('/get-courses-filter', async function (req, res) {
  //cat1, cat2, lecturer = null nghia la chon het
  var Cat1ID = req.query.Cat1ID;
  var LectureID = req.query.UserID;
  if (Cat1ID === '0') {
    Cat1ID = null;
  }
  if (LectureID === '0') {
    LectureID = null;
  }
  var filter = {
    Cat1ID,
    Cat2ID: null,
    LectureID
  }
  console.log(filter);

  if (filter.Cat1ID === null && filter.Cat2ID === null && filter.LectureID === null){
    const listCourses = await courseModel.all();
    console.log(listCourses);
    res.json(listCourses);
  }
  else{
    const listCourses = await allCoursesByCatAndLecturer(filter.Cat1ID, filter.Cat2ID, filter.LectureID);
    // console.log("_________________________________________________________________________");
    // console.log("_________________________________________________________________________");
    // console.log("_________________________________________________________________________");
    // console.log("_________________________________________________________________________");
    // console.log("_________________________________________________________________________");
    // console.log("_________________________________________________________________________");
    // console.log("_________________________________________________________________________");
    // console.log("_________________________________________________________________________");
    console.log(listCourses);
    res.json(listCourses);
  }
})






module.exports = router;