const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../models/user');
const auth = require('../middlewares/auth');
const speakeasy = require("speakeasy");
const nodemailer = require('nodemailer');
//const {getCurrency,getStar}=require('../utils/helpers');
//const { authAdmin } = require('../middlewares/auth');

const secret = speakeasy.generateSecret({ length: 20 });


const router = express.Router();
router.get('/register', function(req, res, next) {
    res.render('account/register', {
        layout: false
    });
})
router.get('/sendOTP', function(req, res, next) {
    res.render('account/sendOTP', {
        layout: false
    });
})

router.post('/register', async function(req, res, next) {
    const hash = bcrypt.hashSync(req.body.password, 10);
    //const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const user = {
        email: req.body.email,
        password: hash,
        fullname: req.body.fullname,
        permission: 0
            //isVerified: 0
    }
    req.session.registedUser = user;

    //await userModel.add(user);
    res.render('account/verify', { title: 'Verify An Email', user });
})
router.get('/is-available', async function(req, res) {
    // const email = req.session.registedUser.email;
    // console.log("session: " + email)
    const email = req.query.email;
    // console.log("query: " + email)
    const user = await userModel.findOneByEmail(email);
    if (user === null) {
        return res.json(true);
    }
    res.json(false);
})

router.get('/send-otp', async function(req, res) {
    const email = req.session.registedUser.email;;
    var token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        step: 60
    });
    var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: 'emailforptudw@gmail.com', pass: 'Ptudw2020' } });
    var mailOptions = { from: 'emailforptudw@gmail.com', to: email, subject: 'Account Verification Code', text: 'Your verification code is: ' + token };
    transporter.sendMail(mailOptions, function(err) {
        if (err) {
            console.log(err);
            res.json(false); //'Technical Issue!, Please click on resend for verify your Email.'

        } else {
            res.render('account/sendOTP', { title: 'Verify An Email' });
        }
    });
})
router.post('/verify', async function(req, res, next) {
    const token = req.body.code;
    console.log(token);
    var tokenValidates = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token,
        window: 0,
        step: 60
    });
    if (tokenValidates) {
        console.log('is Verified');
        await userModel.add(req.session.registedUser);
        req.session.registedUser = null;
        res.redirect('account/login');
    } else {
        console.log('wrong code');
        res.redirect(req.headers.referer || '/');
    }


    ///Note direct...
})

router.get('/login', function(req, res) {
    res.render('account/login', {
        layout: false
    });
})

router.post('/login', async function(req, res) {
    const user = await userModel.findOneByEmail(req.body.email);
    console.log(user)
    if (user === null) {
        console.log("null")
        return res.render('account/login', {
            layout: false,
            err_message: 'Invalid username.'
        });
    }

    const ret = bcrypt.compareSync(req.body.password, user.password);
    if (ret === false) {
        return res.render('account/login', {
            layout: false,
            err_message: 'Invalid password.'
        });
    }

    req.session.auth = true;
    req.session.authUser = user;

    const url = req.session.retUrl || '/';
    res.redirect(url);
})

router.post('/logout', async function(req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;

    const url = req.headers.referer || '/';
    res.redirect(url);
})

module.exports = router;