const express = require('express');
const app = express();
const mongoose = require('mongoose');

// module for maintaining sessions
const session = require('express-session');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// path is used the get the path of our files on the computer
const path = require ('path');

app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

// initialization of session middleware 

app.use(session({
  name :'myCustomCookie',
  secret: 'myAppSecret', // encryption key 
  resave: true,
  httpOnly : true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// set the templating engine 
app.set('view engine', 'jade');

//set the views folder
app.set('views',path.join(__dirname + '/app/views'));


const dbPath  = "mongodb://localhost/ecommerceDb";

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

  console.log("database connection open success");

});

// fs module, by default module for file management in nodejs
const fs = require('fs');

// include all our model files
fs.readdirSync('./app/models').forEach(function(file){
	// check if the file is js or not
	if(file.indexOf('.js'))
		// if it is js then include the file from that folder into our express app using require
		require('./app/models/'+file);

});// end for each

// include controllers
fs.readdirSync('./app/controllers').forEach(function(file){
	if(file.indexOf('.js')){
		// include a file as a route constiable
		var route = require('./app/controllers/'+file);
		//call controller function of each file and pass your app instance to it
		route.controller(app);

	}

});
//render main index page
app.get('/',(req,res)=>{
  res.render('index');
});
const userModel = mongoose.model('User');
const auth=require("./middlewares/auth");

//end for each
//using the setLoggedInuser middleware as an application level middleware
//so that it processes every request before responding
//  middleware to set request user(set new values to the session variable if any changes are made) and check which user is logged in 
//check if the user is a legitimate user

app.use(function(req,res,next){
  auth.setLoggedInUser(req,res,next);
  next();
});
  //router to handle any other page request 
    app.route('*')

          .get((req,res,next)=>{

                  res.statusCode = 404;
                  next("Path not found");
          
          })

        .post((req,res,next)=>{

                  res.statusCode = 404;
                  next("Path not found");
              
        });
//application level middleware for error handling of other page request
    app.use((err,req,res,next) =>{

      console.log("this is error handling middleware");
  
      if(res.statusCode==404) {
        const myResponse = responseGenerator.generate(true,"Page Not Found,Go Back To HomePage",404,null);
        res.render('error', {
            message: myResponse.message,
            status: myResponse.status
        });
      }
  
      else {
        console.log(err);
        res.send(err);
      }

    });


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });	

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});