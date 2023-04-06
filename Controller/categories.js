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
      '/categories',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let recommendedProducts=await doQuery("select * from products where isRecommended=1;" , [] , true);

            let currUser=await doQuery("select * from users where id_users=?;" , [req.id_users] , true);
            if(currUser != false) currUser=currUser[0];

            res.render('categoriesPg.ejs' , {products: recommendedProducts, currUser: currUser});
      }

);


//-------------------------------------------------------


module.exports=router;
