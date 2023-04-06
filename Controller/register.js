if(process.env.NODE_ENV !== 'production') require('dotenv').config();


//importing built ins
const express=require("express");
const app=express();
const jwt=require("jsonwebtoken");
const cookieParser=require('cookie-parser');
const bcrypt=require('bcryptjs');


//importing file based
const doQuery=require('../Model/myModules/doQuery.js');
const {onlyIfLoggedIn, onlyIfLoggedOut}=require("../Model/myModules/protectMyRoutes.js");


//app use of imports
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());
app.use( express.urlencoded( { extended: true } ) ); // this line is must to receive req.body from the forms


//router
const router=express.Router();


//-------------------------------------------------------


router.get
(
      '/register',
      onlyIfLoggedOut,
      (req, res, next)=>
      {
            res.render('registerPg.ejs');
      }

);


router.post
(
      '/register',
      onlyIfLoggedOut,
      async (req, res, next)=>
      {
            let name=req.body.name;
            let email=req.body.email;
            let password=req.body.password;
            let userType=req.body.userType;


            let isAlreadyRegistered=await doQuery('select * from users where email=?' , [email] , true);
            if(isAlreadyRegistered !== false) isAlreadyRegistered=true;

            if(isAlreadyRegistered) return res.send('alreadyRegistered');

            doQuery('insert into users (name, email, password, userType) values (?,?,?,?)' , [name, email, password, userType] , false);

            res.send('regComplete');
      }

);


//-------------------------------------------------------


module.exports=router;
