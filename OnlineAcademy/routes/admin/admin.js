const express = require('express');
const categoryModel = require('../../models/category');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('account/admin/index', { title: "Admin-Dashboard", layout: false });
})


router.get('/my-profile', function (req, res) {
  res.render('account/admin/profile', { title: "Admin-Profile", layout: false });
})



module.exports = router;