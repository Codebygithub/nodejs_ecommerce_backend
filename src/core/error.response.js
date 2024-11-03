'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNAUTHORIED: 401

}
const ReasonStatusCode = {
    FORBIDDEN: 'BAD REQUEST ERROR', 
    CONFLICT: 'Conflict error',
    UNAUTHORIED:'Unauth'
}
class ErrorResponse extends Error {
    constructor(message,status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT,statusCode = StatusCode.CONFLICT) {
        super(message,statusCode)
    }
}


class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN,statusCode = StatusCode.FORBIDDEN) {
        super(message,statusCode)
    }
}

class UnauthoriedError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIED,statusCode = StatusCode.UNAUTHORIED) {
        super(message,statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError ,
    UnauthoriedError
}