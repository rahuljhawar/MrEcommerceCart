const mongoose = require('mongoose');
const express = require('express');

const productRouter  = express.Router();
const productModel = mongoose.model('Product');
const userModel = mongoose.model('Product');
const cartModel = mongoose.model('Product');
const responseGenerator = require('./../../libs/responseGenerator');
const auth = require("./../../middlewares/auth");

module.exports.controller=(app) => {

  productRouter.get('/addproduct_page',(req,res)=>{
   res.render('addproduct');
 });


//router to get all products
productRouter.get('/products',auth.checkLogin,(req,res) =>{
  productModel.find({},(err,allProducts)=>{
    if(err){                
      const myResponse = responseGenerator.generate(true,"There was some error retrieving the products"+err,500,null);
             // res.send(myResponse);
             res.render('error', {
               message: myResponse.message,
               error: myResponse.data
             });
           }else if(allProducts==''){

            res.render('products',{
            	productCheck:false
            });
          }
          else{

            res.render('products',{
             productCheck:true,
             products:allProducts

           });

          }
        });

});

//router to post a product
productRouter.post('/addproduct',(req,res)=>{

  if(req.body.productname!=undefined && req.body.productcategory!=undefined && req.body.productdesc!=undefined && req.body.productprice!=undefined && req.body.sellername!=undefined){

    const newProduct = new productModel({
      productName  		: req.body.productname,
      productCategory  	: req.body.productcategory,
      productDescription	: req.body.productdesc,
      productPrice 		: req.body.productprice,
      sellerName			: req.body.sellername


            });// end new user 

    newProduct.save((err)=>{
      if(err){

        const myResponse = responseGenerator.generate(true,"some error"+err,500,null);
             // res.send(myResponse);
             res.render('error', {
               message: myResponse.message,
               error: myResponse.data
             });

           }
           else{

            const myResponse = responseGenerator.generate(false,"Product successfully added!",200,newProduct);
                  // res.send(myResponse);
                  console.log('New product added..')
                  req.session.product = newProduct;
                  res.redirect('/users/products')
                }

            });//end new product save


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

      });

    //router to view a product
    productRouter.get('/product/view/:id',auth.checkLogin,(req,res)=>{

      productModel.findOne({'_id':req.params.id},(err,foundProduct)=>{
        if(err){
         const myResponse = responseGenerator.generate(true,"There was some error retreiving the product!!",500,null);
         res.render('error', {
           message: myResponse.message,
           error: myResponse.data
         });
       }
       else{

        res.render('productview', { product:foundProduct  });

      }

    });
      

    });


    //router to get a product for edit
    productRouter.get('/product/edit/:id',auth.checkLogin,(req,res)=>{

      productModel.findOne({'_id':req.params.id},(err,foundProduct)=>{
        if(err){
         const myResponse = responseGenerator.generate(true,"There was some error retreiving the product!!",500,null);
         res.render('error', {
           message: myResponse.message,
           error: myResponse.data
         });
       }
       else{

        res.render('producteditview', { product:foundProduct  });

      }

    });
      

    });

    //router to post edited product
    productRouter.post('/productedit/:id',auth.checkLogin,(req,res)=>{
          let product ={};

          product.productName = req.body.productname;
          product.category = req.body.productcategory;
          product.productDescription = req.body.productdesc;
          product.productPrice = req.body.productprice;
          product.sellerName = req.body.sellername;

            productModel.findOneAndUpdate({'_id': req.params.id},product, (err)=> {
             if (err) {

               const myResponse = responseGenerator.generate(true,"Product Not Found..",404,null);
               res.render('error',{
                message: myResponse.message,
                error: myResponse.data
              });
             } 
             else {


            console.log('Edited product..');
            res.redirect('/users/products');


          }

        });
    });

//router to delete a product
productRouter.post('/product/delete/:id',(req, res) =>{

	productModel.remove({'_id':req.params.id},(err,result)=>{

		if(err){
			const myResponse = responseGenerator.generate(true,"There was some error deleting the product",500,null);
			res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
		}
		else{
			console.log("Deleted product..");
			res.redirect('/users/products');



		}


	});
});


app.use('/users',productRouter);
}