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
      '/productsList',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_categories=req.query.id_categories;

            let productsList=await doQuery("select * from products where id_categories=? and isApproved=1;" , [id_categories] , true);

            res.render('productsListPg.ejs' , {productsList: productsList, id_categories: id_categories});
      }

);


//-------------------------------------------------------


module.exports=router;
