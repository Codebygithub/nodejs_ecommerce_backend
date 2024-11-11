'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('./checkAuth')
const { UnauthoriedError, NotFound } = require('../core/error.response')
const {findByUserId} = require('../services/keyToken.service')


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION:'authorization',
    CLIENT_ID:'x-client-id',
    REFRESHTOKEN:'refreshtoken',
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


const authentication = asyncHandler( async (req,res,next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new UnauthoriedError('Invalid Request')
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new UnauthorizedError('Not Found KeyStore')
    if(req.headers[HEADER.REFRESHTOKEN]) {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN]
        try {
            const decodeUser = JWT.verify(refreshToken,keyStore.privateKey)
            if(userId !== decodeUser.userId) throw new UnauthorizedError('Invalid userId')
            req.keyStore = keyStore
            req.refreshToken = refreshToken
            req.user = decodeUser
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new UnauthorizedError('Invalid Request Token')
    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new UnauthorizedError('Invalid userId')
        req.keyStore = keyStore
        return next();
    } catch (error) {
        throw error;
    }
})

const verifyJWT = async(token , secretKey) =>{
    return await JWT.verify(token, secretKey);
}


module.exports = {
    createTokenPair,
    authentication ,
    verifyJWT
}