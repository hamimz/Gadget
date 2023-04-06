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
      '/adminProductRequests',
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


            res.render('adminProductRequests.ejs', {newArr: newArr});
      }

);


router.post
(
      '/deleteRequest',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_productRequests=req.body.id_productRequests;

            doQuery('delete from productRequests where id_productRequests=?', [id_productRequests], false);

            res.send(true);
      }

);

//-------------------------------------------------------


module.exports=router;