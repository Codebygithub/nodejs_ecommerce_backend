'use strict';

const { Created } = require("../core/success.response");
const AccessService = require("../services/access.serverice");

class AccessController {
   login = async (req, res,next) => {
        new Created({
                message: 'Success login',
                metadata: await AccessService.login(req.body)
        }).send(res)

   }    
   signUp = async (req,res,next) => {
           new Created({
            message: ' Successfully Registered' , 
            metadata: await AccessService.signUp(req.body)
           }).send(res)
       
   }
   logout = async (req, res , next) => {
        new Created({
                message:'Successfully Log out' ,
                metadata:await AccessService.logout({keyStore:req.keyStore})
        })     
   }
   handleRefreshToken = async (req,res,next) => {
        new Created({
                message: 'Succesfully Refresh Token' ,
                metadata:await AccessService.handleRefreshToken({refreshToken:req.refreshToken, user:req.user , keyStore:req.keyStore})
        }).send(res)
   }
}

module.exports = new AccessController();