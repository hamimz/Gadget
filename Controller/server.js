if(process.env.NODE_ENV !== 'production') require('dotenv').config();


//importing built ins
const express=require("express");
const app=express();
const jwt=require("jsonwebtoken");
const cookieParser=require('cookie-parser');
const path=require('path');


//importing file based


//app use of imports
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname , '../View/views') );
app.use(express.static('../View/public'));
app.use(cookieParser());
app.use( express.urlencoded( { extended: true } ) ); // this line is must to receive req.body from the forms
app.use( express.json() );


// -------------------------------------------------------


//page exists (these have pages)

app.use('/', require('./landing.js'));

app.use('/', require('./login.js'));

app.use('/', require('./register.js'));

app.use('/', require('./categories.js'));

app.use('/', require('./productsList.js'));

app.use('/', require('./product.js'));

app.use('/', require('./admin.js'));

app.use('/', require('./supplier.js'));

app.use('/', require('./requestProductPg.js'));

app.use('/', require('./adminProductRequests.js'));

app.use('/', require('./cart.js'));

app.use('/', require('./payment.js'));


//page does not exist

app.use('/', require('./logout.js'));


//-------------------------------------------------------


app.listen
(
      3000
      ,
      ()=>
      {
            console.log("---------------3000---------------");
      }

);
