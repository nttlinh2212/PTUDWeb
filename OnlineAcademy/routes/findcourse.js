var express = require('express');
var router = express.Router();
var courseModel = require('../models/course')
var categoryModel = require('../models/category')
var userModel = require('../models/user')
var { paginate } = require('../config/default.json')
const { getCurrency, getStar, getTotalRatings, getDayLeft, getDate } = require('../utils/helpers');

// /course/search?key='python'
//trong view nay khi click vao sort thi tuy theo loai minh getJSOn ham ben duoi, con qua trang thi getJSON
// ham nay '/get-list-courses' khoi can phai tai lai trang gi ca
router.get('/', async function(req, res) {
    const key = req.query.key;
    console.log('enter')
    console.log(key);

    const page = 1;

    const total = await courseModel.count_result(key);
    let nPages = Math.floor(total / paginate.limit);
    if (total % paginate.limit > 0) nPages++;

    const offset = (page - 1) * paginate.limit;
    const list = await courseModel.full_text_search(key, offset);
    const listCat2 = await courseModel.full_text_search_cat2(key); //list Cat2 in name Cat2 thui ko can Cat1 dau
    res.render('account/register', {
        //layout:false,//neu muon bo cai layout thi ghi nhu vay nha
        title: 'Result Search',
        list,
        page,
        nPages,
        empty: list.length === 0,
        listCat2
    });
});
//course/search/get-list-courses?key='python'&page=1
router.get('/get-list-courses', async function(req, res) {
    const { key, page } = req.query;
    console.log(key + "kkk" + page);
    const offset = (page - 1) * paginate.limit;
    const list = await courseModel.full_text_search(key, offset);
    res.json(list);
});
// course/search//get-list-cat2?key='python'
// return list cat2
router.get('/get-list-cat2', async function(req, res) {
    const key = req.query;
    console.log(key);
    const list = await courseModel.full_text_search_cat2(key);
    console.log(list)
    res.json(list);
});
router.get('/get-list-courses-by-rating', async function(req, res) {
    const { key, page } = req.query;
    console.log(key + "kkk" + page);
    const offset = (page - 1) * paginate.limit;
    const list = await courseModel.full_text_search_by_rating(key, offset);
    res.json(list);
});
router.get('/get-list-courses-by-price', async function(req, res) {
    const { key, page } = req.query;
    console.log(key + "kkk" + page);
    const offset = (page - 1) * paginate.limit;
    const list = await courseModel.full_text_search_by_price(key, offset);
    res.json(list);
});
module.exports = router;