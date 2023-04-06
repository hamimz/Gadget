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
      '/product',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.query.id_products;

            let product=await doQuery("select * from products where id_products=?;" , [id_products] , true);
            if(product!=false) product=product[0];

            let reviews=await doQuery("select * from reviews where id_products=?;" , [id_products] , true);

            let userName;
            let totalRating=0;
            for(let i=0; i<=reviews.length-1; i++) 
            {
                  totalRating=totalRating+reviews[i].rating;

                  userName=await doQuery("select name from users where id_users=?;" , [reviews[i].id_users] , true);
                  if(userName != false) userName=userName[0].name;

                  reviews[i].userName=userName;
            };

            let avgRating=(totalRating)/(reviews.length);
            
            res.render('productPg.ejs' , {product: product, reviews: reviews, avgRating: avgRating});
      }

);


router.post
(
      '/submitReview',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.body.id_products;
            let comment=req.body.comment;
            let rating=req.body.rating


            let isAlreadyReviewed=await doQuery("select * from reviews where id_products=? and id_users=?;", [id_products, req.id_users] , true);
            if(isAlreadyReviewed !== false) isAlreadyReviewed=true;

            if(isAlreadyReviewed===false) doQuery("insert into reviews (comment, rating, date, id_users, id_products) values(?, ?, now(), ?, ?);" , [comment, rating, req.id_users, id_products] , false);
            else doQuery("update reviews set comment=?, rating=?, date=now() where id_users=? and id_products=?;" , [comment, rating, req.id_users, id_products] , false);

            res.send(true);
      }

);


router.post
(
      '/deleteReview',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.body.id_products;


            doQuery("delete from reviews where id_users=? and id_products=?;" , [req.id_users, id_products] , false);

            res.send(true);
      }

);


router.post
(
      '/addToCart',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.body.id_products;

            doQuery('insert into cart (id_users, id_products) values (?, ?);', [req.id_users, id_products], false);

            res.end();
      }

);


//-------------------------------------------------------


module.exports=router;
