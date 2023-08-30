'use strict'

const JWT = require('jsonwebtoken')

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

module.exports = {
    createTokenPair
}