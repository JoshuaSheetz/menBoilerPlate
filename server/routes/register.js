(function() {
	exports.registerPage = function(req, res) {
		var styleSheets = [
				'stylesheets/register.css'
			],
			javascripts = [
				{
					link: 'scripts/register.min.js'
				}
			],
			registerPageVars = {
				title: 'Registration',
				layout: './templates/masterTemplate',
				body: './partials/loginReg/register',
				bodyClass: 'registerPage',
				styleSheets: styleSheets,
				javascripts: javascripts,
				isLoginPage: false
			};

		res.render('partials/loginReg/register', registerPageVars);
	};

	exports.registerAction = function(req, res) {
		//TODO Create registration confirm email
		var registerPageVars = {
				title: 'Registration Complete',
				layout: './templates/loginTemplate',
				bodyClass: 'registerPage',
				isLoginPage: true,
				registerMsgCode: 'success',
				registerMsg: 'Registration Successful'
			},
			regLoginEmail = req.body.regLoginEmail,
			regAlias = req.body.regAlias,
			regLoginPassword = req.body.regLoginPassword,
			regLoginConfirmPassword = req.body.regLoginConfirmPassword,
			regFirstName = req.body.regFirstName,
			regLastName = req.body.regLastName;

		//	res.send(regLoginEmail+' - '+regAlias+' - '+regLoginPassword+' - '+regFirstName+' - '+regLastName);

		res.render('partials/loginReg/login', registerPageVars);
		//res.render('partials/loginReg/login', registerPageVars);
	}

}());