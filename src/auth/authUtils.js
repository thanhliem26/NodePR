'use strict'
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const asyncHandler = require('../helpers/asyncHandler');
const JWT = require('jsonwebtoken');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = JWT.sign(payload, publicKey, { expiresIn: '2 days' });
        const refreshToken = JWT.sign(payload, privateKey, { expiresIn: '7 days' });

        //

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error(error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) throw new AuthFailureError('Invalid Request user_id!');

    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Not Found keyStore');

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthFailureError('Inavlid Request access token');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

        if(userId !== decodeUser.userId) throw new AuthFailureError("Invalid UserId");
        req.keyStore = keyStore;
        return next()
    } catch(error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}