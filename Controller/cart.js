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
      '/cart',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let cartItems=await doQuery('select * from cart where id_users=?', [req.id_users], true);

            let newArr=[];
            let totalPrice=0;
            for(let i=0; i<=cartItems.length-1; i++)
            {
                  let item=await doQuery('select * from products where id_products=?', [cartItems[i].id_products], true);

                  newArr.push({id_products: item[0].id_products, name: item[0].name, price: item[0].price});

                  totalPrice=totalPrice+item[0].price;
            };

            res.render('cartPg.ejs', {newArr: newArr, totalPrice: totalPrice});
      }

);


router.post
(
      '/removeItem',
      onlyIfLoggedIn,
      async (req, res, next)=>
      {
            let id_products=req.body.id_products;

            doQuery('delete from cart where id_products=? limit 1;', [id_products], false);

            res.end();
      }

);


//-------------------------------------------------------


module.exports=router;
