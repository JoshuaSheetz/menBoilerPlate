(function () {
	var AccountController = function (userModel, session, mailer) {
		this.crypto = require('crypto');
		this.uuid = require('node-uuid');
		this.ApiResponse = require('../models/apiResponse.js');
		this.ApiMessages = require('../models/apiMessages.js');
		this.UserProfileModel = require('../models/userProfile.js');
		this.userModel = userModel;
		this.session = session;
		this.mailer = mailer;
	};

	AccountController.prototype.getSession = function () {
		return this.session;
	};

	AccountController.prototype.setSession = function (session) {
		this.session = session;
	};

	AccountController.prototype.hashPassword = function (password, salt, callback) {
		//use pbkdf2 to ahsh and iterate 10k times by default
		var iterations = 10000,
			keyLen = 64; //64 bit

		this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
	};

	/**
	 * @method logon: Gets email from user, checks vs db, hashes pwd and make sure the password is a match
	 * @param email (String) : Email input value from login form
	 * @param password (String) : Password input value from login form
	 * @param callback (Function) : Call back function will contain ApiResponse object with success and extras->msg
	 */
	AccountController.prototype.logon = function (email, password, callback) {
		var ac = this;//ac = AccountController

		ac.userModel.findOne({ email: email }, function (err, user) {
			if (err) {
				return callback(err, new ac.ApiResponse({
					success: false,
					extras: {
						msg: ac.ApiMessages.DB_ERROR
					}
				}));
			}

			if (user) {
				ac.hashPassword(password, user.passwordSalt, function (err, passwordHash) {
					if (passwordHash == user.passwordHash) {
						var userProfileModel = new ac.UserProfileModel({
							email: user.email,
							firstName: user.firstName,
							lastName: user.lastName,
							lastLogin: Date.now()
						});

						ac.session.userProfileModel = userProfileModel;

						return callback(err, new ac.ApiResponse({
							success: true,
							extras: {
								userProfileModel: userProfileModel
							}
						}));
					}
					else {
						return callback(err, new ac.ApiResponse({
							success: false,
							extras: {
								msg: ac.ApiMessages.INVALID_PWD
							}
						}));
					}
				});
			}
			else {
				return callback(err, new ac.ApiResponse({
					success: false,
					extras: {
						msg: ac.ApiMessages.EMAIL_NOT_FOUND
					}
				}));
			}
		});
	};

	AccountController.prototype.logoff = function () {
		if (this.session.userProfileModal) {
			delete this.session.userProfileModel;
		}

		return;
	};

	AccountController.prototype.register = function (newUser, callback) {
		var ac = this;

		//Check if email exists in db
		this.userModel.findOne({ email: newUser.email }, function (err, user) {
			if (err) {
				return callback(err, new ac.ApiResponse({
					success: false,
					extras: {
						msg: ac.ApiMessages.DB_ERROR
					}
				}));
			}

			//If email exists in DB, it is already registered
			if (user) {
				return callback(err, new ac.ApiResponse ({
					success: false,
					extras: {
						msg: ac.ApiMessages.EMAIL_ALREADY_EXISTS
					}
				}));
			}

			//If not attempt to save email
			else {
				newUser.save(function (err, user, numberAffected) {
					if (err) {
						return callback(err, new ac.ApiResponse({
							success: false,
							extras: {
								msg: ac.ApiMessages.DB_ERROR
							}
						}));
					}

					//If insert was success, create user profile model and send back to caller
					if (numberAffected === 1) {
						var userProfileModal = new ac.UserProfileModel({
							email: user.email,
							firstName: user.firstName,
							lastName: user.lastName,
							lastLogin: user.lastLogin
						});

						return callback(err, new ac.ApiResponse({
							success: true,
							extras: {
								userProfileModal: userProfileModal
							}
						}));
					}
					//Generic fail error (info was bad, json corrupt, etc)
					else {
						return callback(err, new ac.ApiResponse({
							success: false,
							extras: {
								msg: ac.ApiMessages.COULD_NOT_CREATE_USER
							}
						}));
					}
				});
			}
		});
	};

	AccountController.prototype.resetPassword = function (email, callback) {
		var ac = this;

		ac.userModel.findOne({ email: emaill }, function (err, user) {
			var passwordResetHash;

			if (err) {
				return callback(err, new ac.ApiResponse({
					success: false,
					extras: {
						msg: ac.ApiMessages.DB_ERROR
					}
				}));
			}

			passwordResetHash = ac.uuid.v4();
			ac.session.passwordResetHash = passwordResetHash;
			ac.session.emailWhoRequestedPasswordReset = email;

			ac.mailer.sendPasswordResetHash(email, passwordResetHash);

			return callback(err, new ac.ApiResponse({
				success: true,
				extras: {
					passwordResetHash: passwordResetHash
				}
			}));
		});
	};

	AccountController.prototype.resetPasswordFinal = function (email, newPassword, passwordResetHash, callback) {
		var ac = this;

		if (!me.session || !me.session.passwordResetHash) {
			return callback(null, new ac.ApiResponse({
				success: false,
				extras: {
					msg: ac.ApiMessages.PASSWORD_RESET_EXPIRED
				}
			}));
		}

		if (me.session.passwordResetHash !== passwordResetHash) {
			return callback(null, new ac.ApiResponse({
				success: false,
				extras: {
					msg: ac.ApiMessages.PASSWORD_RESET_HASH_MISMATCH
				}
			}));
		}

		if (me.session.emailWhoRequestedPasswordReset !== email) {
			return callback(null, new ac.ApiResponse({
				success: false,
				extras: {
					msg: ac.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH
				}
			}));
		}

		var passwordSalt = this.uuid.v4();

		ac.hashPassword(newPassword, passwordSalt, function (err, passwordHash) {
			ac.userModel.update({email: email},
				{
					passwordHash: passwordHash,
					passwordSalt: passwordSalt
				}, function(err, numberAffected, raw) {
					if (err) {
						return callback(err, new ac.ApiResponse({
							success: false,
							extras: {
								msg: ac.ApiMessages.DB_ERROR
							}
						}));
					}

					if (numberAffected < 1) {
						return callback(err, new ac.ApiResponse({
							success: false,
							extras: {
								msg: ac. ApiMessages.COULD_NOT_RESET_PASSWORD
							}
						}));
					}
					else {
						return callback(err, new ac.ApiResponse({
							success: true,
							extras: null
						}));
					}
				}
			);
		});
	};

	module.exports = AccountController;
});