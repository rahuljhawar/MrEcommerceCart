// defining a mongoose schema 
// including the module
var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var productSchema = new Schema({

	productName  		: {type:String,default:'',required:true},
	productCategory  	: {type:String,default:''},
	productDescription	: {type:String,default:''},
	productPrice 		: {type:Number,default:'',required:true},
	createdOn			: {type:Date,default:Date.now},
	sellerName			: {type:String}


	

});



mongoose.model('Product',productSchema);