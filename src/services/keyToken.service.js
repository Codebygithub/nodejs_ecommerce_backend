'use strict';

const keytokenModel = require("../models/keytoken.model");
const {Types} = require('mongoose')
const JWT = require('jsonwebtoken')

class KeyTokenService {
    static createKeyToken = async ({userId , publicKey , privateKey,refreshToken}) => {
        // try {
        //     const publicKeyString = publicKey.toString();
        //     const tokens = await keytokenModel.create({
        //         user:userId ,
        //         publicKey:publicKeyString
        //     }) 
        //     return tokens ? tokens.publicKey : null 
        // } catch (error) {
        //     return error
        // }
        try {
            const filter = {user:userId} 
            const update = {publicKey , privateKey , refreshTokensUsed:[] , refreshToken}
            const options = {upsert : true , new:true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null ;    
        } catch (error) {
            return error.message
        }
        
        

        }
        static findByUserId = async (userId) => {
          return await keytokenModel.findOne({user:new Types.ObjectId(userId)}).lean();

        }
        static removeById = async (id) => {
            return await keytokenModel.remove(id);
        }
        static findByRefreshTokenUsed = async (refreshToken) => {
            return await keytokenModel.findOne({refreshTokensUsed:refreshToken})
        }
        static findByRefreshToken = async (refreshToken) => {
            return await keytokenModel.findOne({refreshToken})
        }
        
        static removeKeyStore = async(userId) => {
            return await keytokenModel.deleteOne({user:userId})
        }
    }
    


module.exports = KeyTokenService