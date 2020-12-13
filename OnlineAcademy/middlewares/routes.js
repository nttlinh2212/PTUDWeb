var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var courseRouter = require('../routes/course');

module.exports = function (app) {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/course', courseRouter);
    
    
    
    // catch 404 and forward to error handler
    app.use(function(req, res) {
      //next(createError(404));
      res.render('404');
    });
    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
    
        console.log(err);
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}