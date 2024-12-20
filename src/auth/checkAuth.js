'use strict' ;

const { BadRequestError } = require("../core/error.response");
const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION:'authorization',
}
const apiKey = async (req,res,next)=> {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key) return res.status(403).json({
            message:'Forbidden error'
        })
        const objKey = await findById(key)
        if(!objKey) return res.status(403).json({
            message:'Forbidden error'
        })
        req.objKey = objKey
        return next();
    } catch (error) {
        next(error)
    }
}
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey || !req.objKey.permissions) {
            throw new BadRequestError('Permission denied');
        }

        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            throw new BadRequestError('Permission denied');
        }
        
        return next();
    };
};



const asyncHandler = fn => {
    return (req, res,next) => {
        fn(req, res, next).catch(next);
    }
}
module.exports = {
    apiKey,
    permission,
    asyncHandler
}