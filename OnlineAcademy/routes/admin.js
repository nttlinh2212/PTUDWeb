var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('account/admin/index', { title: 'Express', layout: false });
});
router.get('/cat1', function (req, res, next) {
  res.render('account/admin/cat1', { title: 'Express', layout: false });
});
module.exports = router;
