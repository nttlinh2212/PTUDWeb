const express = require('express');
const categoryModel = require('../models/category');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await categoryModel.allCat2();
  res.render('admin/cat2', {
    categories: list,
    empty: list.length === 0
  });
})

router.get('/edit', async function (req, res) {
  const id = req.query.id;
  const category = await categoryModel.findCat2(id);
  if (category === null) {
    return res.redirect('/admin/cat2');
  }

  res.render('admin/cat2/edit', {
    category
  });
})

router.get('/add', function (req, res) {
  res.render('admin/cat2/add');
})

router.post('/add', async function (req, res) {
  await categoryModel.addCat2(req.body);
  res.render('/admin/cat2');
})

router.post('/del', async function (req, res) {
  await categoryModel.delCat2(req.body.CatID);
  res.redirect('/admin/cat2');
})

router.post('/update', async function (req, res) {
  await categoryModel.updateCat2(req.body);
  res.redirect('/admin/cat2');
})

module.exports = router;