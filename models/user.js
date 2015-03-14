var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
		user_id : {type : String, required: true},
		device_id : {type : String, required: true},
		register_date : { type: Date, default : Date.now },
		device_platform : { type : String, required : true},
		endpointArn : {type : String, required: true}
 });



module.exports = mongoose.model('users', userSchema);


