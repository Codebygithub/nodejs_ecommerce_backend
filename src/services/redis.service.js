'use strict'
const {reservationInventory} = require('../repository/inventory_repo')

const redis = require('redis')
const redisClient = redis.createClient()
const {promisify} = require('util')
const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)
const acquireLock = async (productId , quantity , cartId) => {
    const key = `lock_v2024_${productId}`
    const retryTime = 10 ;
    const expireTime = 3000
    for (let i = 0; i < retryTime.length; i++) {
      const result = await setnxAsync(key , expireTime)
      if(result === 1 ) {
        const isReversation = await reservationInventory({
          productId , quantity,cartId
        })
        if(isReversation.modifiedCount) {
          await pexpire(key,expireTime)
          return key
        }
        return null;
      }
      else {
        await new Promise((resolve) => setTimeout(resolve , 50))
      }
        
    }
}
const releaseLock =async  keyLock => {
  const delAsyncKey = promisify(redisClient.DEL).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports =  {
acquireLock , releaseLock 
}
