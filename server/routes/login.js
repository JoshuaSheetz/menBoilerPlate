(function() {

	exports.loginPage = function(req, res) {
		var styleSheets = [
				'stylesheets/login.css'
			],
			javascripts = [
				{
					link: 'scripts/login.min.js'
				}
			],
			loginPageVars = {
				title: 'Login',
				layout: './templates/masterTemplate',
				body: './partials/loginReg/register',
				bodyClass: 'loginPage',
				styleSheets: styleSheets,
				javascripts: javascripts,
				isLoginPage: true
			};

		res.render('partials/loginReg/login', loginPageVars);
	};

}());