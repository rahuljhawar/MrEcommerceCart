const mongoose = require('mongoose');
const express = require('express');
// express router // used to define routes 
const userRouter  = express.Router();
const userModel = mongoose.model('User')
const responseGenerator = require('./../../libs/responseGenerator');
const auth = require("./../../middlewares/auth");

module.exports.controller=(app)=>{ 

  userRouter.get('/login_page', (req,res)=>{

    res.render('login');

    });//end get login screen

  userRouter.get('/signup_page',(req,res)=>{

    res.render('signup');

    });//end get signup screen

  userRouter.get('/dashboard',auth.checkLogin,(req,res)=>{

    res.render('dashboard',{user:req.session.user});


    });//end get dashboard
  userRouter.get('/forgotpassword_page',(req,res)=>{
    res.render('forgotpassword',{
      initialview:false,
      securityCheck:false
    });
  });

  userRouter.get('/logout',(req,res)=>{

    req.session.destroy(function(err){
      res.redirect('/users/login_page');

    })  

    });//end logout

    //router for user signup
      userRouter.post('/signup',(req,res)=>{

        if(req.body.username!=undefined && req.body.firstname!=undefined && req.body.lastname!=undefined && req.body.email!=undefined && req.body.password!=undefined){

          const newUser = new userModel({
            userName            : req.body.username,
            firstName           : req.body.firstname,
            lastName            : req.body.lastname,
            email               : req.body.email,
            mobileNumber        : req.body.mnumber,
            password            : req.body.password,
            securityQuestion    : req.body.squestion,
            securityAnswer      : req.body.sanswer



            });// end new user 

          newUser.save(function(err){
            if(err){

              const myResponse = responseGenerator.generate(true,"some error"+err,500,null);
             // res.send(myResponse);
             res.render('error', {
               message: myResponse.message,
               error: myResponse.data
             });

           }
           else{

            const myResponse = responseGenerator.generate(false,"successfully signup user",200,newUser);
                  // res.send(myResponse);
                  req.session.user = newUser;
                  delete req.session.user.password;
                  res.redirect('/users/dashboard')
                }

            });//end new user save


        }
        else{

          const myResponse = {
            error: true,
            message: "Some body parameter is missing",
            status: 403,
            data: null
          };

          //res.send(myResponse);

          res.render('error', {
           message: myResponse.message,
           error: myResponse.data
         });
          
        }


    });//end signup route

      //router for forgot password
      userRouter.post('/forgotpassword',(req,res)=>{
        userModel.findOne({'email':req.body.email},(err,foundUser)=>{
            if(err){
            const myResponse = responseGenerator.generate(true,"some error"+err,500,null);
               //res.send(myResponse);
               res.render('error', {
                message: myResponse.message,
                error: myResponse.data
               });
           }
           else if(foundUser==null || foundUser==undefined || foundUser.email==undefined){
            const myResponse = responseGenerator.generate(true,"This email address has not been registered!",404,null);
               //res.send(myResponse);
               res.render('error', {
                message: myResponse.message,
                error: myResponse.data
               });

           }
           else{
            req.session.user=foundUser;
            res.render('forgotpassword',{
               initialview:true,
               securityQuestion:foundUser.securityQuestion
            });
           
           }
        });

       });

      //extended security question check route for forgot password
      userRouter.post('/securitycheck',(req,res)=>{
          if(req.session.user.securityAnswer === req.body.checkanswer){
              res.render('forgotpassword',{
                initialview:true,
                securityCheck:true,
                password:req.session.user.password
              });
        }else{
             const myResponse = responseGenerator.generate(true,"Your security answer is wrong!!",404,null);
             res.render('error', {
              message: myResponse.message,
              error: myResponse.data
             });

            }

          });

      //route for user login
      userRouter.post('/login',(req,res)=>{
         
        userModel.findOne({$and:[{'email':req.body.email},{'password':req.body.pwd}]},(err,foundUser)=>{

          if(err){
            const myResponse = responseGenerator.generate(true,"some error"+err,500,null);
            res.send(myResponse);
          }
          else if(foundUser==null || foundUser==undefined || foundUser.userName==undefined){

            const myResponse = responseGenerator.generate(true,"user not found. Check your email and password",404,null);
            //res.send(myResponse);
            res.render('error', {
              message: myResponse.message,
              error: myResponse.data
            });

          }
          else{
            const myResponse = responseGenerator.generate(false,"logged in",200,foundUser);
            //res.send(myResponse);
                  req.session.user = foundUser;
                  delete req.session.user.password;
                  res.redirect('/users/dashboard')
                  
                }

        });// end find


    });


 
      //router to handle any other page request 
    userRouter.route('*')

          .get((req,res,next)=>{

                  res.statusCode = 404;
                  next("Path not found");
          
          })

        .post((req,res,next)=>{

                  res.statusCode = 404;
                  next("Path not found");
              
        });
//router level middleware for error handling of other page request
    userRouter.use((err,req,res,next) =>{

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


    // this should be the last line
    // now making it global to app using a middleware
    // think of this as naming your api 
    app.use('/users',userRouter);

  }