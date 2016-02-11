var mongoose = require('mongoose');

module.exports = mongoose.model('Users', {
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	userName: {type: String, required: true},
	password: {type: String, required: true}
});