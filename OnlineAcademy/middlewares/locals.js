const categoryModel = require('../models/category');
const cartModel = require('../models/cart');
module.exports = function(app) {
    app.use(function(req, res, next) {
        console.log(req.session.auth,res.locals.authUser,'here au fist');
        if (typeof(req.session.auth) === 'undefined') {
            req.session.auth = false;
           
        }
        if (typeof(req.session.cart) === 'undefined'){
            req.session.cart = [];
        }
        res.locals.auth = req.session.auth;
        res.locals.authUser = req.session.authUser;
        res.locals.cartSummary = cartModel.getNumberOfItems(req.session.cart);
        console.log(req.session.auth,res.locals.authUser,'here au');
        next();
    });

    app.use(async function(req, res, next) {
        res.locals.lstCat1 = await categoryModel.allCat1();
        //console.log(res.locals.lstCat1);
        res.locals.lstCat2 = [];
        //res.locals.lstCat2.push(res.locals.lstCat1);

        for (const cat1 of res.locals.lstCat1) {
            const lcat2 = await categoryModel.allCat2(cat1.Cat1ID);
            //console.log(lcat2);
            //console.log(res.locals.lstCat2+'fffffff');
            res.locals.lstCat2.push(lcat2);
        }
        console.log(res.locals.lstCat1,'ls cat1');
        console.log(res.locals.lstCat2,'ls cat 2');
        next();
    });
}