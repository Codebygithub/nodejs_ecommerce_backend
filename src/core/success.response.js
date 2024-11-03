'use strict';



const StatusCode = {
    Ok: 200,
    Created: 201
}
const ReasonStatusCode = {
    Ok: 'Success', 
    Created: 'Created',
}

class SuccessResponse {
    constructor({message , statusCode = StatusCode.Ok , reasonStatusCode = ReasonStatusCode.Ok , metadata = {}}){
        this.message = !message ? reasonStatusCode.Ok : message ,
        this.status = statusCode , 
        this.metadata = metadata 

    }
    send(res,header = {}) {
        return res.status(this.status).json(this)
    }
}

class Ok extends SuccessResponse {
    constructor({message , metadata}){
        super({message, metadata})
    }
}

class Created extends SuccessResponse {
    constructor({message , statusCode = StatusCode.Created, reasonStatusCode = ReasonStatusCode.Created , metadata}) {
        super({message, statusCode, reasonStatusCode, metadata})
    }
}

module.exports = {
    Ok , Created
}