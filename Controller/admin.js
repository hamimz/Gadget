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
      '/adminPg',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            //checking if current user is admin or not start
            let currUser=await doQuery("select * from users where id_users=?;" , [req.id_users] , true);

            let userType;
            if(currUser != false)
            {
                  userType=currUser[0].userType;
            };

            if(userType !== 'admin')
            {
                  return res.send('<h1>You are not authorized to view this page.</h1><h2>This page is only for Admin users.</h2>');
            };
            //checking if current user is admin or not end


            let productsArr=await doQuery("select * from products where isApproved=1;" , [] , true);

            let usersArr=await doQuery("select * from users;" , [] , true);             

            return res.render('adminPg.ejs' , {productsArr, usersArr});
      }

);


router.post
(
      '/recommendProduct',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.body.id_products;

            doQuery("update products set isRecommended=1 where id_products=?;" , [id_products] , false);

            res.send(true);
      }

);


router.post
(
      '/unRecommendProduct',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.body.id_products;

            doQuery("update products set isRecommended=0 where id_products=?;" , [id_products] , false);

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


router.post
(
      '/deleteUser',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_users=req.body.id_users;

            if(id_users===req.id_users)
            {
                  return res.send(false);
            };

            doQuery("delete from users where id_users=?;" , [id_users] , false);

            res.send(true);
      }

);


router.get
(
      '/pendingProducts',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let pendingProducts=await doQuery('select * from products where isApproved=0;', [], true);

            res.render('pendingProducts.ejs', {pendingProducts: pendingProducts});
      }
);


router.post
(
      '/approveProduct',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.body.id_products;

            doQuery('update products set isApproved=1 where id_products=?;', [id_products], false);

            res.end();
      }

);


router.get
(
      '/showPromotionRequests',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let promotionRequests=await doQuery('select * from promotionRequests;', [], true);

            res.render('showPromotionRequests.ejs', {promReq: promotionRequests});
      }
);


router.post
(
      '/deletePromRequest',
      onlyIfLoggedIn,
      (req, res, next)=>
      {
            let id_promotionRequests=req.body.id_promotionRequests;

            doQuery('delete from promotionRequests where id_promotionRequests=?;', [id_promotionRequests], false);

            res.end();
      }

);


//-------------------------------------------------------


module.exports=router;
