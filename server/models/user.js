(function () {
	'use strict';

	var //index = require('../routes/index'),
		mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		UserSchema;

	UserSchema = new Schema({
		email: { type: String, unique: true },
		password: String,
		passwordHash: String,
		passwordSalt: String,
		firstName: String,
		lastName: String,
		alias: String,
		lastLogin: { type: Date, default: Date.now }
	});

	mongoose.model('User', UserSchema);
	// once this has been done, one can obtain the model
	// in other files with: User = mongoose.model('User');
	module.exports = mongoose.model('User', UserSchema);

}());