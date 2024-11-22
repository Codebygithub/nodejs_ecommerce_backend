'use strict' 
const {Types} = require('mongoose')
const _ = require('lodash');

const getInfoData = ({fileds = [] , object = {}}) => {
    return _.pick(object,fileds)
}

const convertoObjectId = id =>  new Types.ObjectId(id)
const getSelectData = (select = []) => {
    if (!select || !Array.isArray(select)) return '';
    return select.join(' '); 
};


const unGetSelectData = (select=[]) => {
    return Object.fromEntries(select.map(el => [el,0]))
}

const remmoveUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if(obj[key] === undefined || obj[key] === null) 
            delete obj[key];
    })
    return obj
}
const updateNestedObjectParser = obj => {
    const final = {} 
    Object.keys(obj).forEach(k => {
        if( typeof obj[k] === 'Object' && !Array.isArray() ) {
            const res = updateNestedObjectParser(obj[k])
            Object.keys(res).forEach(a => {
                final[`${k}.${a}`] = res[a]
            }
        )}
        else {
            final[k] = obj[k]
        }
    })
    return final
}
module.exports= {
    getInfoData,
    unGetSelectData,
    getSelectData,
    remmoveUndefinedObject,
    updateNestedObjectParser,
    convertoObjectId
}