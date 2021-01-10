const express = require('express');
const userModel = require('../models/user');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await userModel.allStuAndLecturer();
  res.render('admin/account', {
    accounts: list,
    empty: list.length === 0
  });
})

router.get('/edit', async function (req, res) {
  const id = req.query.id;
  const user = await userModel.find(id);
  if (user === null) {
    return res.redirect('/admin/account');
  }

  res.render('admin/account/edit', {
    user
  });
})

router.get('/add', function (req, res) {
  res.render('admin/account/add');
})

router.post('/add', async function (req, res) {
  await userModel.add(req.body);
  res.render('/admin/account');
})

router.post('/del', async function (req, res) {
  await userModel.del(req.body.CatID);
  res.redirect('/admin/account');
})

router.post('/update', async function (req, res) {
  await userModel.update(req.body);
  res.redirect('/admin/account');
})

module.exports = router;