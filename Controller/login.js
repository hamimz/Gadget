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
      '/login',
      onlyIfLoggedOut,
      (req, res, next)=>
      {
            res.render('loginPg.ejs');
      }

);


router.post
(
      '/login',
      onlyIfLoggedOut,
      async (req, res, next)=>
      {
            let email=req.body.email;
            let password=req.body.password;


            let userFromDB=await doQuery('select * from users where email=?' , [email] , true);
            
            if(userFromDB === false)
            {
                  return res.send('emailNotRegistered');
            };

            userFromDB=userFromDB[0];

            if(userFromDB.password !== password)
            {
                  return res.send('pwdNotMatched');
            };


            return res.json({id_users: userFromDB.id_users, userName: userFromDB.name});
      }

);


//-------------------------------------------------------


module.exports=router;
