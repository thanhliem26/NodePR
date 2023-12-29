'use strict'

const redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repository/inventory');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquiredLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; //3 seconds tam lock

    for(let i = 0; i < retryTimes.length; i++) {
        //tao key, ai giu dc thi vao thanh toan
        const result = await setnxAsync(key, expireTime)
        if(result === 1) {
            //thao tac voi inventory
            const isReversation = await reservationInventory({ productId, quantity, cartId })
            if(isReversation.modifiedCount) {
                await pexpire(key, expireTime)

                return key
            }

            return null;
        } else {
            await new Promise((resolve) => {
                setTimeout(resolve, 50)
            })
        }
    }
}

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);

    return await delAsyncKey(keyLock)
}

module.exports = {
    acquiredLock,
    releaseLock
}
