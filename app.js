var express = require('express'),
	path = require('path'),
	//fs = require('fs'),//added in tutorial
	hbs = require('hbs'),//added in tutorial
	exphbs   = require('express-handlebars'),
	//favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	//index includes all includes/requires
	requires = require('./server/routes'),//will look for index.js

	//app express object
	app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Register handlebars directories so files are known where to be read from
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/views/partials/loginReg');
hbs.registerPartials(__dirname + '/views/partials/includes');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Routing files and dirs
app.use(express.static(path.join(__dirname, 'public')));

app.use('/bootstrap',  express.static(__dirname + '/bower_components/bootstrap/dist/js'));
app.use('/jquery',  express.static(__dirname + '/bower_components/jquery/dist'));
app.use('/handlebars',  express.static(__dirname + '/bower_components/handlebars'));

/*****************
 URL Routing
 ******************/
//Front facing site, not logged in
//app.use('/', index.loginPage);
app.get('/', requires.login.loginPage);

/*****************
 Register page
 *****************/
app.get('/register', requires.register.registerPage);
app.post('/register', requires.register.registerAction);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found, AHHHHHH');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;