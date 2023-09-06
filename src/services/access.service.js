'use strict'
const shopModal = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, ConflictRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

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