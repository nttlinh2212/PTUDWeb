const express = require('express');
const courseModel = require('../../models/course');
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