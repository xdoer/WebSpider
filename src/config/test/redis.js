


const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)

/**
 * redis配置项
 * 更多配置项参考:https://www.npmjs.com/package/redis
 */
const config = {
  host: '127.0.0.1',
  port: 6379,
  connect_timeout: 3600000,
  // password: null
}

let client = redis.createClient(config)
client.on('error', err => {
  console.log('Redis出错', err)
})

module.exports = client