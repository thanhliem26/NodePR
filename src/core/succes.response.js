'use strict'

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
}

const RESPON_STATUS_CODE =  {
    OK: 'Succes',
    CREATED: 'Created'
}

class SuccessResponse {
    constructor({message, statusCode = STATUS_CODE.OK, reasonStatusCode = RESPON_STATUS_CODE.OK, metadata = {}}) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata})
    }
}

class CREATED extends SuccessResponse {
    constructor({options, message, statusCode = STATUS_CODE.CREATED, reasonStatusCode = RESPON_STATUS_CODE.CREATED, metadata}) {
        super({message, statusCode, reasonStatusCode, metadata})
        this.options = options;
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse
}