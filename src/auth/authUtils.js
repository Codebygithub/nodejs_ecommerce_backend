'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('./checkAuth')
const { UnauthoriedError, NotFound } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION:'authorization',
    CLIENT_ID:'x-client-id',
}
const createTokenPair = async (payload , publicKey,privateKey) =>{
    try {
        const accessToken = await JWT.sign(payload ,publicKey , {
            expiresIn:'2 days'
        })
        const refreshToken = await JWT.sign(payload ,privateKey , {
            expiresIn:'7 days'
        })

        JWT.verify(accessToken,publicKey , (err,decode)=> {
            if(err) 
                console.error('error verifying' , err)
            else {
                console.log('decode', decode)
            }
        })

        return {accessToken , refreshToken}
    } catch (error) {
        
    }
}


const authentication = async (req, res , next)  => {
    try {
        const userId = req.headers[HEADER.CLIENT_ID] 
        if (!userId) throw new UnauthoriedError('Invalid request')
        const keyStore = await KeyTokenService.findByUserId(userId)
        if(!keyStore) throw new NotFound('No key store found')
        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if(!accessToken) throw new UnauthoriedError('No token found')
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new UnauthorizedError('Invalid user')
        req.decodeUser = decodeUser
        next();
    } catch (error) {
        next(error);
    }

}

const verifyJWT = async(token , secretKey) =>{
    return await JWT.verify(token, secretKey);
}


module.exports = {
    createTokenPair,
    authentication ,
    verifyJWT
}