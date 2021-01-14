const express = require('express');
const userModel = require('../../models/user');
const bcrypt = require('bcryptjs');


const router = express.Router();


function getAllStuOrLecOrAd(userList, classify) {
    var resultList = [];

    userList.forEach(function(item) {
        if (item.type_of_account === classify) {
            resultList.push(item);
        }
    })
    console.log(resultList);
    return resultList;
}



router.get('/', async function(req, res) {
    const list = await userModel.allStuAndLecturer();
    var LecturerList = getAllStuOrLecOrAd(list, 1);


    res.render('account/admin/lecturer/index', {
        title: "Admin - Manage Lecturer",
        LecturerList,
        empty: LecturerList.length === 0,
        layout: false
    });
})



router.get('/add-lecturer-page', function(req, res) {
    res.render('account/admin/lecturer/add-lecturer', {
        title: "Admin - Add Lecturer",
        layout: false
    });
})


router.get('/add-lecturer', async function(req, res) {
    const lecturerItem = req.query;
    lecturerItem.password = bcrypt.hashSync(lecturerItem.password, 10);
    // console.log(lecturerItem);

    const result = await userModel.add(lecturerItem);
    console.log(result);
    if (result) {
        res.json({ result: "true" });
    } else {
        res.json({ result: "false" });
    }
})


router.get('/get-list-lecturer', async function(req, res) {
    const list = await userModel.allStuAndLecturer();
    var LecturerList = getAllStuOrLecOrAd(list, 1);

    res.json(LecturerList);
})


router.get('/reset-password', async function(req, res) {
    const lecturer = req.query;
    lecturer.password = bcrypt.hashSync(lecturer.password, 10);
    console.log(lecturer);
    var result = await userModel.update(lecturer);
    res.json(result);
})


router.get('/delete', async function(req, res) {
    const LecturerID = req.query.ID;
    console.log(LecturerID);
    var result = await userModel.del(LecturerID);
    console.log(result);
    res.json({ result: 'true' });
})

router.get('/disable', async function(req, res) {
    const LecturerID = req.query.ID;
    console.log(LecturerID);
    var result = await userModel.del(LecturerID);
    console.log(result);
    res.json({ result: 'true' });
})


module.exports = router;