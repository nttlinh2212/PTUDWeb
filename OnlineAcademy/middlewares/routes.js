var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var courseRouter = require('../routes/course');
var accountRouter = require('../routes/account');
var fcourseRouter = require('../routes/findcourse');
var studentRouter = require('../routes/student');
var lecturerRouter = require('../routes/lecturer');
var cartRouter = require('../routes/cart');
const { authLecture, authStudent, authAdmin } = require('./auth');
module.exports = function (app) {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/course/search', fcourseRouter);
    app.use('/course', courseRouter);
    app.use('/account', accountRouter);
    app.use('/student', authStudent,studentRouter);
    app.use('/lecturer',authLecture, lecturerRouter);
    app.use('/admin',authAdmin, require('../routes/admin/admin'));
    app.use('/admin/lecturer',authAdmin, require('../routes/admin/lecturer'));
    app.use('/admin/student',authAdmin, require('../routes/admin/student'));
    app.use('/admin/category',authAdmin, require('../routes/admin/category'));
    app.use('/admin/course',authAdmin, require('../routes/admin/course'));
    app.use('/cart', cartRouter);


    // catch 404 and forward to error handler
    app.use(function(req, res) {
        //next(createError(404));
        res.render('404', { title: "404" });
    });
    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        console.log(err);
        // render the error page
        res.status(err.status || 500);
        res.render('500', { title: "505" });
    });
}