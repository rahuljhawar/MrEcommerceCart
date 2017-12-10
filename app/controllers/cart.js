const mongoose = require('mongoose');
const express = require('express');
const cartRouter  = express.Router();
const cartModel = mongoose.model('Cart');
const userModel = mongoose.model('User');
const productModel = mongoose.model('Product');
const responseGenerator = require('./../../libs/responseGenerator');
const auth = require("./../../middlewares/auth");

module.exports.controller=(app) => {

	cartRouter.get('/cart_products',auth.checkLogin,(req,res)=>{
		res.render('cartproductsview',{user:req.session.user});
	});


//router to add a product to the cart
	cartRouter.get('/addtocart/:id',auth.checkLogin,(req,res)=>{
   productModel.findOne({'_id':req.params.id},(err,foundProduct)=>{
    if(!err){
     const newCartProduct = new cartModel({

      productName         : foundProduct.productName,
      productCategory     : foundProduct.productCategory,
      productDescription  : foundProduct.productDescription,
      productPrice        : foundProduct.productPrice,
      sellerName          : foundProduct.sellerName

    });

     newCartProduct.save((err, cartproduct)=>{
      if(!err){
        userModel.findByIdAndUpdate(req.session.user._id,{$push: {"cart": cartproduct}},
          {safe: true, upsert: true, new : true},(err,updateduser)=>{
            req.session.user=updateduser;
            res.redirect('/users/cart_products') ;
          })
      }
      else{

       console.log("Some error");
       const myResponse = responseGenerator.generate(true, "Sorry! product can't be added to store right now..." + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                      message: myResponse.message,
                      error: myResponse.data
                    });
                  }
                });
   }
   else{

    console.log("Some error");
    const myResponse = responseGenerator.generate(true, "Sorry! product can't be added to store right now..." + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                      message: myResponse.message,
                      error: myResponse.data
                    });

                  }

                });


 });

  // router to remove the products from the cart
	cartRouter.post('/cartproduct/delete/:id',(req, res) =>{


    userModel.findByIdAndUpdate(req.session.user._id,{$pull: { cart: { _id: req.params.id}}},
      {safe: true,new : true},(err,updateduser)=>{
        if(!err){

          req.session.user=updateduser;
          res.redirect('/users/cart_products') ;

        }
        else{
          const myResponse = responseGenerator.generate(true,"There was some error deleting the product from cart",500,null);
          res.render('error',{
            message: myResponse.message,
            error: myResponse.data
          });


        }


      });

  });  

	app.use('/users',cartRouter);
}