'use strict'

const { Types } = require('mongoose');
const KeyTokenMoel= require('../models/keytoken.model');

class keyTokenService {

    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // const tokens = await KeyTokenMoel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            const filter = { user: userId};
            const update = {publicKey, privateKey, refreshTokenUsed: [], refreshToken};
            const options = { upsert: true, new: true }

            const tokens = await KeyTokenMoel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null;
        } catch(error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {
        const key = await KeyTokenMoel.findOne({user: new Types.ObjectId(userId)})
        return key;
    }

    static removeKeyById = async (id) => {
        return await KeyTokenMoel.deleteOne(id);
    }

    static findByRefreshTokenUsed =  async (refreshToken) => {
        return await KeyTokenMoel.findOne({refreshTokenUsed: refreshToken}).lean()
    }

    static deleteKeyById = async ( userId ) => {
        return await KeyTokenMoel.deleteOne({user: new Types.ObjectId(userId)})
    }

    static findByRefreshTokenByUser = async (refreshToken) => {
        return await KeyTokenMoel.findOne({refreshToken: refreshToken})
    }
}

module.exports = keyTokenService;