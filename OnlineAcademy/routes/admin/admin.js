const express = require('express');
const userModel = require('../../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('account/admin/index', { title: "Admin-Dashboard", layout: false });
})


router.get('/my-profile', function (req, res) {
  res.render('account/admin/profile', { title: "Admin-Profile", layout: false });
})


router.get('/change-password', async function (req, res) {
  var adminObj = await userModel.find(req.session.authUser.UserID);
  console.log(adminObj);
  console.log(req.query);

  const ret = bcrypt.compareSync(req.query.oldPassword, adminObj.password);
  // console.log(ret);

  
  if (ret) {
    var Obj = {
      password : bcrypt.hashSync(req.query.newPassword, 10),
      UserID: adminObj.UserID
    }
    // console.log(Obj);
    var result = await userModel.update(Obj);
    // console.log(result);

    if(result){
      res.json({ result: "true" });
    }else{
      res.json({ result: "false" });
    }
  }
  else {
    res.json({ result: "false" });
  }
})


router.get('/change-email', async function (req, res) {
  var adminObj = await userModel.find(req.session.authUser.UserID);
  console.log(adminObj);
  console.log(req.query);

  if (adminObj.email === req.query.oldEmail) {
    adminObj.email = req.query.newEmail;
    var result = await userModel.update(adminObj);
    // console.log(result);
    
    if (result) {
      res.json({ result: "true" });
    } else {
      // Email duplicate
      res.json({ result: "duplicate" });
    }
  }
  else {
    // Sai old email
    res.json({ result: "false" });
  }
})



module.exports = router;