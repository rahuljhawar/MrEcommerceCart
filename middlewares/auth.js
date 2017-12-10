var mongoose = require('mongoose');
var userModel = mongoose.model('User');

module.exports.checkLogin = function(req,res,next){

	if( !req.session.user){
		res.redirect('/users/login_page');
	}
	else{

		next();
	}

}// end checkLogin

module.exports.setLoggedInUser = function(req,res,next){

	if(req.session && req.session.user){
		userModel.findOne({'email':req.session.user.email},function(err,user){

			if(user){
				req.user = user;
				delete req.user.password; 
				req.session.user = user;
				next();
			}
			else{
				// do nothing , because this is just to set the values
			}
		});
	}
	else{
		next();
	}


}//

module.exports.checkEmail = function(req,res,next){
	
}