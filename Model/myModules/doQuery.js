//must import database.js file at first

const db=require('./database.js');


//-------------------------------------------------------


function doQuery(sqlStmt, dataArr, willReturn)
{
      if(willReturn)
      {
            return new Promise
            (
                  (resolve, reject)=>
                  {
                        db.query
                        (
                              sqlStmt,
                              dataArr,
                              (error, result)=>
                              {
                                    if(error) console.log(error);


                                    //this code is for SELECT statements
                                    //here result is an objArr
                                    if(result.constructor===Array)
                                    {
                                          if(result.length>0) resolve(result);
                                          resolve(false);
                                    }

                                    //this code is for INSERT statements
                                    //here result is a single obj only
                                    else
                                    {
                                          resolve(result.insertId)
                                    };
                                    

                                    //I did not write anything for DELETE or UPDATE statements
                                    //delete statements return a single obj only (just like insert statements)
                                    //delete statements will return 0 for result.insertId
                              }
            
                        );
                        
                  }
      
            )

      }

      else
      {
            db.query
            (
                  sqlStmt,
                  dataArr,
                  (error, objArr)=>
                  {
                        if(error) console.log(error);
                  }

            );

      }

};


module.exports=doQuery;