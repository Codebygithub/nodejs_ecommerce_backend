'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt') 
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const {getInfoData}= require("../utils");
const { BadRequestError, UnauthoriedError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
    SHOP:1,
    WRITER:2,
    EDITOR:3,
    ADMIN:4
}
class AccessService {

    

    static signUp = async ({name,email,password}) => {
        
            //find user email
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop)  {
                throw new BadRequestError('Error: Shop already exists')

            }
            const passwordHash = await bcrypt.hash(password,10);

            //create user account
            const newShop = await shopModel.create({
                name , email , password:passwordHash , roles:[RoleShop.SHOP]
            })
            if(newShop) {

                //random string by crypto
               
               const privateKey = crypto.randomBytes(64).toString('hex')
               const publicKey = crypto.randomBytes(64).toString('hex')

                const keyStore= await KeyTokenService.createKeyToken({
                    userId:newShop._id,
                    publicKey,
                    privateKey
                })
                if(!keyStore) 
                {
                    throw new BadRequestError('Error: Key Store failed to be created')

                }
                const tokens = await createTokenPair({userId:newShop._id,email},publicKey,privateKey)
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
        
    }
    static login = async ({email, password , refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if(!foundShop) {
            throw new BadRequestError('Shop not registered')
        }
        const matchPassword = bcrypt.compare(password , foundShop.password)
        if(!matchPassword) {
            throw new UnauthoriedError('Password mismatch')
        }

        const privateKey = crypto.randomBytes(65).toString('hex')
        const publicKey = crypto.randomBytes(65).toString('hex')

        const {_id:userId} = foundShop

        const tokens = await createTokenPair({userId,email},publicKey,privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken:tokens.refreshToken,
            publicKey , privateKey , userId
            
        })
        return {
            shop:getInfoData({fileds:['_id','name','email'],object:foundShop}) ,
            tokens
        }
        




    }
    static logout = async ({keyStore}) => {
        const delKey = await KeyTokenService.removeById(keyStore._id);
        return delKey;
    }

    static handleRefreshToken = async (refreshToken) => {
        //find refreshToken used 
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if(foundToken) {
            //decode user 
            const {userId , email} = await verifyJWT(refreshToken,foundToken.privateKey)
            //xoa key
            await KeyTokenService.removeKeyStore(userId)
            throw new ForbiddenError('Could not remove')

        }

        //find refreshToken in dbs
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new UnauthoriedError('error registered')
        const {userId , email} = await KeyTokenService.verifyJWT(refreshToken,holderToken.privateKey);

        // find user in dbs
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new UnauthoriedError('error registered')
        const tokens = await createTokenPair({userId,email} , holderToken.publicKey , holderToken.privateKey)
        await holderToken.update({
            $set:{refreshToken: tokens.refreshToken} ,
            $addToSet:{
                refreshTokenUsed:refreshToken
            }
        })
        return {
            userId:{userId,email},
            tokens
        }



    }
}
module.exports = AccessService