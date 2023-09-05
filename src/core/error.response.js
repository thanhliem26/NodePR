'use strict'

const STATUS_CODE = {
    FORBIDDEN: 403,
    CONFLICT: 409,
}

const RESPON_STATUS_CODE =  {
    FORBIDDENT: 'Bad request error',
    CONFLICT: 'Conflict error'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = RESPON_STATUS_CODE.CONFLICT, statusCode = STATUS_CODE.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = RESPON_STATUS_CODE.FORBIDDENT, statusCode = STATUS_CODE.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}