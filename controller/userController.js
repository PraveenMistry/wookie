const User      = require('../models/users')
const jwt       = require('jsonwebtoken')
const bcrypt    = require('bcrypt')
const secretKey = process.env.SECRET_KEY;

let invalideJWT = function(){
    res.clearCookie('authToken');
}

module.exports = {
    register: function (req, res) {
        console.log("register")
        const today = new Date();

        const userData = {
            username: req.body.username,
            password: req.body.password,
            createdAt: today
        }
        User.findOne({
        where: {
            username: req.body.username
        }
        })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    userData.password = hash
                    User.create(userData)
                    .then(user => {
                        res.json({status:'success',message:'Register successfully',error:''})
                    })
                    .catch(err => {
                        res.status(500).json({status:'failed','error':err})
                    })
                })
                
            } else {
                res.status(400).json({ status:'failed',error: 'User already exists with '+req.body.username+'.' })
            }
        })
        .catch(err => {
            res.status(500).json({status:'failed','error':err})
        })
    },
    login: function(req,res){
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({
            where: {
                username: username
            }
          })
            .then(user => {
              if (user) {
                  if(bcrypt.compareSync(password,user.password)){
                      let token = jwt.sign(user.dataValues, secretKey, {
                          expiresIn: 18000
                      })
                      res.cookie('authToken', token);
                      res.json({ status:"success", username:user.username, token: token })
                  }else{
                    res.status(200).send({status:'failed',message:'Wrong Password!'});
                  }
              } else {
                res.status(200).json({status:'success',message:'User does not exist'});
              }
            })
            .catch(err => {
                res.status(500).json({status:'failed',error:err})
            })
    }
};
