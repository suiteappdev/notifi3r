var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var awsConfSchema = new Schema({
  "accessKeyId": String,
  "secretAccessKey": String,
  "region": String,
  "androidArn": String
});


module.exports = mongoose.model('aws', awsConfSchema);