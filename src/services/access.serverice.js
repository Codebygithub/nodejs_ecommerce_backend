'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt') 
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const {getInfoData}= require("../utils")
const RoleShop = {
    SHOP:1,
    WRITER:2,
    EDITOR:3,
    ADMIN:4
}
class AccessService {

    static signUp = async ({name,email,password}) => {
        try {
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop)  {
                return {
                    code:'xxxx',
                    message:'Shop already registered'
                }

            }
            const passwordHash = await bcrypt.hash(password,10);
            const newShop = await shopModel.create({
                name , email , password:passwordHash , roles:[RoleShop.SHOP]
            })
            if(newShop) {
                const {privateKey , publicKey} = crypto.generateKeyPairSync('rsa',{
                    modulusLength:4096,
                    publicKeyEncoding:{ 
                        type:'pkcs1',
                        format:'pem'
                    },
                    privateKeyEncoding:{ 
                        type:'pkcs1',
                        format:'pem'
                    }
                })
                console.log({privateKey , publicKey})

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId:newShop._id,
                    publicKey
                })
                if(!publicKeyString) 
                {
                    return {
                        code:'xxx',
                        message:'publicKeyString error'
                    }
                }
                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                const tokens = await createTokenPair({userId:newShop._id,email},publicKeyObject,privateKey)
                console.log('created Token' , tokens)
                return {
                    code:201,
                    metadata: {
                        shop:getInfoData({fileds:['_id','name','email'],object:newShop},publicKey),
                        tokens
                    }
                }
            }
            return {
                code:200 ,
                metadata:null
            }
        } catch (error) {
            return {
                code:'xxx',
                message:error.message,
                status:'error'
            }
        }
    }
}
module.exports = AccessService