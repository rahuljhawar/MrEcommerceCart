// defining a mongoose schema 
// including the module
var mongoose = require('mongoose');
// declare schema object.

var Schema = mongoose.Schema;

var cartSchema = new Schema({

	productName  		: {type:String,default:''},
	productCategory  	: {type:String,default:''},
	productDescription	: {type:String,default:''},
	productPrice	  	: {type:String,default:''},
	sellerName		  	: {type:String,default:''},

});


module.exports=mongoose.model('Cart',cartSchema);