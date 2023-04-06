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
      '/requestProductPg',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            res.render('requestProductPg.ejs');
      }

);


router.post
(
      '/productRequest',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let productRequest=req.body.productRequest;

            doQuery('insert into productRequests (productRequest, id_users) values (?, ?)', [productRequest, req.id_users], false);

            res.send(true);
      }

);
      
      
//-------------------------------------------------------
      
      
module.exports=router;