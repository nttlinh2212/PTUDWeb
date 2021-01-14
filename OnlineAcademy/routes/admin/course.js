const express = require('express');
const courseModel = require('../../models/course');
const { update, allCoursesByCatAndLecturer } = require('../../models/findCourse');
const router = express.Router();



router.get('/', async function (req, res) {
  res.render('account/admin/course/index', {
    title: "Admin-Course",
    layout: false
  });
})


router.get('/get-courses', async function (req, res) {
  const listCourses = await courseModel.all();
  res.json(listCourses);
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
  const course ={
    CourseID,
    disable: 1,
  }
  const result = await update(course);
  res.json(true);
});
router.get('/enable-course', async function (req, res, next) {
  console.log(req.query);
  const CourseID = req.query.CourseID;
  const course ={
    CourseID,
    disable: 0,
  }
  const result = await update(course);
  res.json(true);//lun lun true
});

router.get('/get-courses-filter', async function (req, res) {
  //cat1, cat2, lecturer = null nghia la chon het
  const test ={Cat1ID:null, Cat2ID:1,LecturerID: null};
  if(test.Cat1ID===null&&test.Cat2ID===null&&test.LectureID===null)
    return res.json(await courseModel.all());
  const listCourses = await allCoursesByCatAndLecturer(test.Cat1ID,test.Cat2ID,test.LecturerID);
  res.json(listCourses);
})






































router.get('/edit', async function (req, res) {
  const id = req.query.id;
  const category = await categoryModel.findCat1(id);
  if (category === null) {
    return res.redirect('/admin/cat1');
  }

  res.render('admin/cat1/edit', {
    category
  });
})

router.get('/add', function (req, res) {
  res.render('admin/cat1/add');
})

router.post('/add', async function (req, res) {
  await categoryModel.addCat1(req.body);
  res.render('/admin/cat1');
})

router.post('/del', async function (req, res) {
  await categoryModel.delCat1(req.body.CatID);
  res.redirect('/admin/cat1');
})

router.post('/update', async function (req, res) {
  await categoryModel.updateCat1(req.body);
  res.redirect('/admin/cat1');
})

module.exports = router;