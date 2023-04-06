if(process.env.NODE_ENV !== 'production') require('dotenv').config();


var mysql=require('mysql');
 

var db=mysql.createPool
(
      {
            user: process.env.dbUser,
            password: '',
            database: process.env.dbName,
            host: process.env.dbHost,
            port: process.env.dbPort,
            charset : 'utf8mb4'
      }

);


module.exports=db;