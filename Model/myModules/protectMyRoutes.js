//all routes must contain either onlyIfLoggedIn or onlyIfLoggedOut functions
//otherwise the req.user will be undefined


if(process.env.NODE_ENV !== 'production') require('dotenv').config();


//built ins
const jwt=require("jsonwebtoken");
const cookieParser=require('cookie-parser');


//file based


//-------------------------------------------------------


function onlyIfLoggedIn(req, res, next)
{
      let id_users=req.cookies.id_users;
    
      if(id_users===undefined)
      {
            return res.redirect('/login');
      }

      else
      {
            req.id_users=id_users;
            return next();
      };

};


function onlyIfLoggedOut(req, res, next)
{
      let id_users=req.cookies.id_users;
      
      if(id_users===undefined)
      {
            return next();
      }
      
      else
      {
            req.id_users=id_users;
            return res.redirect('/categories');
      };

};


module.exports={onlyIfLoggedIn, onlyIfLoggedOut};
