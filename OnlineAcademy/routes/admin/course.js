const express = require('express');
const categoryModel = require('../../models/category');

const router = express.Router();

router.get('/', async function (req, res) {
  const cat1 = await categoryModel.allCat1();
  console.log(cat1);
  res.render('account/admin/category/index', {
    title:"Admin-Category",
    cat1: cat1,
    empty: cat1.length === 0,
    layout:false
  });
})

// getJson('/get-list-cat2',{cat1id=2})
router.get('/get-list-cat2', async function (req, res, next) {
  //truyen vao list cat1 ,cat2
  console.log(req.query);
  const Cat1ID = req.query.cat1ID;
  const list_cat2 = await categoryModel.allCat2(Cat1ID);//list cat2 cho truong hop chon cat1id la 1
  //khi nguoi dung cho cat1id khac thi getjson de lay lai list cat2 id
  console.log('here cat2:', list_cat2);
  res.json(list_cat2);
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