//This file is read in app.js and lists all includes for the application
(function() {
	module.exports = {
		//Pages
		login: require('./login'),
		register: require('./register'),

		//Models
		user: require('../models/user'),

		//Controllers
		accountCtrl: require('../controllers/account'),
		registerCtrl: require('../controllers/register')
	};
}());