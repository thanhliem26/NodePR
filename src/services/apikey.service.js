'use strict'

const apiKeyModel = require("../models/apiKey.model")
const crypto = require('crypto')

const findById = async (key) => {
    try {
        const objKey = await apiKeyModel.findOne({key, status: true}).lean();
    
        return objKey;
    } catch(e) {
        throw new Error(e)
    }
    
}

module.exports = {
    findById
}
