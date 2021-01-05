var express = require('express');
var router = express.Router();
var courseModel = require('../models/course')
var categoryModel = require('../models/category')
var userModel = require('../models/user')
var {paginate} = require('../config/default.json')
const { getCurrency, getStar,getTotalRatings,getDayLeft,getDate } = require('../utils/helpers');

// /course/search?key='python'
router.get('/', async function (req, res) {
    const key = req.query.key;
    console.log(key);
    
    const page =  1;

    const total = await courseModel.count_result(key);
    let nPages = Math.floor(total / paginate.limit);
    if (total % paginate.limit > 0) nPages++;

    const offset = (page - 1) * paginate.limit;
    const list = await courseModel.full_text_search(key, offset);
    
    res.render('course/search', {
        title:'Result Search',
        list,
        page,
        nPages,
        empty: list.length === 0,
        getDayLeft,
        getDate
    });
});
//course/search/get-list-courses?key='python'&page=1
router.get('/get-list-courses', async function (req, res) {
    const {key,page} = req.query;
    console.log(key+"kkk"+page);
    const offset = (page - 1) * paginate.limit;
    const list = await courseModel.full_text_search(key,offset);
    res.json(list);
});
//course/search//get-list-cat2?key='python'&page=1
//return list cat2
router.get('/get-list-cat2', async function (req, res) {
    const key = req.query;
    console.log(key);
    const list = await courseModel.full_text_search_cat2(key);
    res.json(list);
});
router.get('/get-list-courses-by-rating', async function (req, res) {
    const {key,page} = req.query;
    console.log(key+"kkk"+page);
    const offset = (page - 1) * paginate.limit;
    const list = await courseModel.full_text_search_by_rating(key,offset);
    res.json(list);
});
router.get('/get-list-courses-by-price', async function (req, res) {
    const {key,page} = req.query;
    console.log(key+"kkk"+page);
    const offset = (page - 1) * paginate.limit;
    const list = await courseModel.full_text_search_by_price(key,offset);
    res.json(list);
});
module.exports = router;