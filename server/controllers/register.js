(function () {
	var RegisterController = function (userModel, session, mailer) {
		this.crypto = require('crypto');
		this.uuid = require('node-uuid');
		this.ApiResponse = require('../models/apiResponse.js');
		this.ApiMessages = require('../models/apiMessages.js');
		this.UserProfileModel = require('../models/userProfile.js');
		this.userModel = userModel;
		this.session = session;
		this.mailer = mailer;
	};

	RegisterController.prototype.getSession = function () {
		return this.session;
	};
}());