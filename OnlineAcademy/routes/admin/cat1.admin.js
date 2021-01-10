const express = require('express');
const categoryModel = require('../models/category');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await categoryModel.allCat1();
  res.render('admin/cat1', {
    categories: list,
    empty: list.length === 0
  });
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