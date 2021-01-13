const express = require('express');
const moment = require('moment');
const cartModel = require('../models/cart');
const courseModel = require('../models/course');
const orderModel = require('../models/order');
const detailModel = require('../models/detail');
const { authStudent } = require('../middlewares/auth');
const { addPart } = require('../models/findCourse');
const { updateNumberOfStudent } = require('../models/course');
const router = express.Router();
const { getCurrency } = require('../utils/helpers');
// /scart 
router.get('/', async function(req, res) {
        const items = [];
        if (req.session.auth === true)
            await cartModel.removeCoursesBought(req.session.cart, req.session.authUser.UserID);
        for (const ci of req.session.cart) {
            const course = await courseModel.findACourse(ci.id);
            items.push({ //cartSummary la bien local nen lun ton tai trong moi view
                course,
                price: course.promotional_price //bo truong nay ra de de lay
            })
        }
        var totals = 0;
        items.forEach(element => {
            totals += element.price;
        });

        res.render('cart/index', {
            title: 'Cart',
            //layout:false,
            items, //list items la list {course,price} chua day du thong tin cua 1 course
            empty: items.length === 0,
            totals,
            getCurrency
        });
    })
    //  getJSON cart/add?id=3
router.get('/add', async function(req, res) {
        const item = {
            id: +req.query.id,
        }
        if (req.session.auth == false)
            return res.json(await cartModel.add(req.session.cart, item, null));
        return res.json(await cartModel.add(req.session.cart, item, req.session.authUser.UserID));
    })
    // getJSON cart/remove?id=3
router.get('/remove', async function(req, res) {
        cartModel.remove(req.session.cart, +req.query.id);
        console.log("remove");
        res.json();
    })
    //  getJSON cart/get-total-money   return total money order
router.get('/get-total-money', async function(req, res) {
    let total = 0;
    for (const ci of req.session.cart) {
        const course = await courseModel.findACourse(ci.id);
        total += course.promotional_price;
    }
    res.json(total);
})

// cart/checkout la post tao mot form rong roi gui ve server //need to login in account student
router.post('/checkout', authStudent, async function(req, res) {
    let total = 0;

    const details = [];
    for (const ci of req.session.cart) {
        const course = await courseModel.findACourse(ci.id);
        total += course.promotional_price;

        details.push({
            CourseID: course.CourseID,
            Price: course.promotional_price,
            OrderID: -1
        });
    }

    const order = {
        OrderDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        StudentID: req.session.authUser.UserID,
        Total: total
    }
    const rs = await orderModel.add(order);
    for (const detail of details) {
        detail.OrderID = rs.insertId;
        await detailModel.add(detail);
        const part = { CourseID: detail.CourseID, StudentID: req.session.authUser.UserID };
        //sau khi mua thi them vao ds tham gia khoa hoc
        await addPart(part);
        await updateNumberOfStudent(detail.CourseID);
    }

    req.session.cart = [];
    res.render('cart/success', { title: 'Order successfully' }); //hoac render ra mot trang thong bao thong tin don hang dat thanh cong
})

module.exports = router;