
const dotenv 	    = require('dotenv').config();
const cookie 	    = require('cookie');
const jwt           = require('jsonwebtoken');
const apiSecret     = process.env.SECRET_KEY; 

module.exports = {
    auth: function(req,res,next){  
         let jsonwebtoken;
         try {
            jsonwebtoken = req.headers['authorization'];
         } catch(err) {
            jsonwebtoken = cookie.parse(req.headers.cookie).authToken; 
         }  
         if(jsonwebtoken){
            try {
                var decodedToken = jwt.verify(jsonwebtoken, apiSecret);
                if(decodedToken){
                  req.userId = decodedToken.id;
                  req.username = decodedToken.username;
                    next();
                }else{
                    console.log(error("Auth token not valid ->" )+req); 
                    res.status(403).json({status:"failed",error:"Unauthorized access"})
                }
             } catch(err) {
                console.log("AUTH error",err); 
                res.status(403).json({status:"failed",error:"Unauthorized access"})
            }
         }else{
            res.status(403).json({status:"failed",error:"Missing authToken in header"})
         }    
    }
};