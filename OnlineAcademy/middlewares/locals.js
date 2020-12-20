const categoryModel = require('../models/category');

module.exports = function (app) {
  app.use(function (req, res, next) {
    if (typeof (req.session.auth) === 'undefined') {
      req.session.auth = false;
    }

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
  });

  app.use(async function (req, res, next) {
    res.locals.lstCat1 = await categoryModel.allCat1();
    //console.log(res.locals.lstCat1);
    res.locals.lstCat2 = [];
    res.locals.lstCat2.push(res.locals.lstCat1);
    
    for (const cat1 of res.locals.lstCat1) {
        const lcat2 = await categoryModel.allCat2(cat1.Cat1ID);
        //console.log(lcat2);
        //console.log(res.locals.lstCat2+'fffffff');
        res.locals.lstCat2.push(lcat2);
    }
    //console.log(res.locals.lstCat1);
    //console.log(res.locals.lstCat2);
    next();
  });
}