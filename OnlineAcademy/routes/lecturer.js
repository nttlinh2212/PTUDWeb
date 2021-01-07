var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('account/lecturer/dashboard', { title: 'Express', layout: false });
});
router.get('/add', function (req, res, next) {
  res.render('account/lecturer/addCourse', { title: 'Express', layout: false });
});

module.exports = router;
