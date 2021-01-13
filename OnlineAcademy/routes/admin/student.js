const express = require('express');
const userModel = require('../../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();


function getAllStuOrLecOrAd(userList, classify) {
  var resultList = [];

  userList.forEach(function (item) {
    if (item.type_of_account === classify) {
      resultList.push(item);
    }
  })
  console.log(resultList);
  return resultList;
}


router.get('/', async function (req, res) {
  res.render('account/admin/student/index', {
    title: "Admin - Manage Student",
    layout: false
  });
})


router.get('/get-list-student', async function (req, res) {
  const list = await userModel.allStuAndLecturer();
  var LecturerList = getAllStuOrLecOrAd(list, 0);

  res.json(LecturerList);
})


router.get('/reset-password', async function (req, res) {
  const student = req.query;
  student.password = bcrypt.hashSync(student.password, 10);
  console.log(student);
  var result = await userModel.update(student);
  res.json(result);
})


router.get('/delete', async function (req, res) {
  const UserID = req.query.ID;
  console.log(UserID);
  var result = await userModel.del(UserID);
  console.log(result);
  res.json(result);
})







module.exports = router;