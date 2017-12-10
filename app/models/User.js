// defining a mongoose schema 
// including the module
var mongoose = require('mongoose');
var Cart = require('./Cart.js');
var CartSchema = mongoose.model('Cart').schema;
// declare schema object.
var Schema = mongoose.Schema;

var userSchema = new Schema({

	userName 			: {type:String,default:'',required:true},
	firstName  			: {type:String,default:''},
	lastName  			: {type:String,default:''},
	email	  			: {type:String,default:''},
	mobileNumber  		: {type:Number,default:''},
	password			: {type:String},
	securityQuestion	: {type:String},
	securityAnswer		: {type:String},
	cart				: [CartSchema]
});


module.exports=mongoose.model('User',userSchema);