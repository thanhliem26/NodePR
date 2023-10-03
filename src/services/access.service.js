'use strict'
const shopModal = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const keytokenModel = require('../models/keytoken.model');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    static handleRefreshTokenV2 = async ({refreshToken, user, keyStore}) => {
        const { userId, email } = user;

        if(keyStore.refreshTokenUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happend !! Pls relogin')
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError("Shop not registed");

        const foundShop = await findByEmail({email});
        if(!foundShop) throw new AuthFailureError("Shop not registed");

        const tokens = await  createTokenPair({ userId: foundShop._id, email }, keyStore.publicKey, keyStore.privateKey);
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user,
            tokens,
        }
    }

    static handleRefreshToken = async (refreshToken) => {
        const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken);

        if(foundToken) {
            //decode user nào đang sử dụng lại refresh token
            const { userId, email } = await verifyJWT( refreshToken, foundToken.privateKey)
            await keyTokenService.deleteKeyById(userId)
          
            throw new ForbiddenError("Something wrong happend !!! Pls relogin")
        }

        const holderToken = await keyTokenService.findByRefreshTokenByUser(refreshToken);

        if(!holderToken) throw new AuthFailureError("Shop not registed");
        const { userId, email } = await verifyJWT( refreshToken, holderToken.privateKey);

        const foundShop = await findByEmail({email});
        if(!foundShop) throw new AuthFailureError("Shop not registed");

        const tokens = await  createTokenPair({ userId: foundShop._id, email }, holderToken.publicKey, holderToken.privateKey);
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user: { userId, email},
            tokens,
        }
    }

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id);
        return delKey;
    }

    static login = async ({ email, password, refreshToken = null}) => {
        //check exits email
        const foundShop = await findByEmail({email});
        if(!foundShop) throw new BadRequestError("Shop not registered")

        //check match password
        const match = bcrypt.compare(password, foundShop.password);
        if(!match) throw new AuthFailureError('Authentication error')


        //create privateKey, public key
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')


        // genarate tokens
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);

        await keyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })

        return {
            metadata: {
                shop: getInfoData({field: ['_id', 'name', 'email'], object: foundShop}),
                tokens,
            }
        }
    }

    static signUp = async ({ name, email, password }) => {
            //step1: check email exists
            const hoderShop = await shopModal.findOne({ email }).lean();

            if (hoderShop) {
                throw new BadRequestError('Error: Shop already registered')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModal.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                //created privateKey, public Key
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    throw new BadRequestError('Error: Key Store Error')
                }

                //create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({field: ['_id', 'name', 'email'], object: newShop}),
                        tokens,
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }
    }
}

module.exports = AccessService;