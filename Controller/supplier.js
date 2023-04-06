if(process.env.NODE_ENV !== 'production') require('dotenv').config();


//importing built ins
const express=require("express");
const app=express();
const jwt=require("jsonwebtoken");
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const bcrypt=require('bcryptjs');


//importing file based
const doQuery=require('../Model/myModules/doQuery.js');
const {onlyIfLoggedIn, onlyIfLoggedOut}=require("../Model/myModules/protectMyRoutes.js");


//app use of imports
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());
app.use( express.urlencoded( { extended: true } ) ); // this line is must to receive req.body from the forms
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use(bodyParser.json());


//router
const router=express.Router();


//-------------------------------------------------------


router.get
(
      '/supplierPg',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            //checking if current user is supplier or not start
            let currUser=await doQuery("select * from users where id_users=?;" , [req.id_users] , true);

            let userType;
            if(currUser != false)
            {
                  userType=currUser[0].userType;
            };

            if(userType !== 'supplier')
            {
                  return res.send('<h1>You are not authorized to view this page.</h1><h2>This page is only for Supplier users.</h2>');
            };
            //checking if current user is supplier or not end


            let productsArr=await doQuery("select * from products where id_users_supplier=?;" , [req.id_users] , true);

            return res.render('supplierPg.ejs' , {productsArr});
      }

);


router.post
(
      '/addProduct',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let name=req.body.name;
            let price=req.body.price;
            let imgSrc=req.body.imgSrc;
            let id_categories=req.body.id_categories;


            doQuery("insert into products (name, price, imgSrc, id_categories, id_users_supplier) values (?,?,?,?,?);" , [name, price, imgSrc, id_categories, req.id_users] , false);

            res.send(true);
      }

);


router.post
(
      '/deleteProduct',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.body.id_products;

            doQuery("delete from products where id_products=?;" , [id_products] , false);

            res.send(true);
      }

);


router.get
(
      '/supplierProductRequests',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let productRequests=await doQuery('select * from productRequests;', [], true);

            let newArr=[];
            for(let i=0; i<=productRequests.length-1; i++)
            {
                  let userName=await doQuery('select name from users where id_users=?', [productRequests[i].id_users], true);
                  newArr[i]=
                  {
                        productRequest: productRequests[i].productRequest,
                        userName: userName[0].name,
                        id_productRequests: productRequests[i].id_productRequests
                  };

            };


            res.render('supplierProductRequests.ejs', {newArr: newArr});
      }

);


router.get
(
      '/promotionRequest',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            res.render('promotionRequest.ejs');
      }

);


router.post
(
      '/promotionRequest',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let promotionRequest=req.body.promotionRequest;

            doQuery('insert into promotionRequests (promotionRequest) values (?);', [promotionRequest], false);

            res.send(true);
      }

);


//-------------------------------------------------------


module.exports=router;
