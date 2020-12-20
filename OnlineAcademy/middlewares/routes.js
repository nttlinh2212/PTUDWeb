module.exports = function (app) {
    app.use('/', require('../routes/index'));
    app.use('/users', require('../routes/users'));
    app.use('/course', require('../routes/course'));
    
    
    
    // catch 404 and forward to error handler
    app.use(function(req, res) {
      res.render('404',{title: "404"});
    });
    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
    
        console.log(err);
        // render the error page
        res.status(err.status || 500);
        // res.render('500',{title: "505"});
    });
}