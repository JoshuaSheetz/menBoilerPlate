//Our DTO Data Transfer Object (all profile models will act this way)
(function () {
	var UserProfileModel = function(cnf) {
		this.email = cnf.email;
		this.firstName = cnf.firstName;
		this.lastName = cnf.lastName;
		this.lastLogin = cnf.lastLogin;
	};

	module.exports = UserProfileModel;
});