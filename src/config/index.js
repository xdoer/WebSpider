const dev = require('./dev')
const test = require('./test')
const prod = require('./prod')

const redis = require('redis')
const bluebird = require('bluebird')
const _env = process.env.NODE_ENV

bluebird.promisifyAll(redis.RedisClient.prototype)

/** 初始化一个redis客户端 */
let client = redis.createClient(require(`./${_env}/redis`))
client.on('error', err => {
  console.log('Redis出错', err)
})

module.exports = {
  ..._env === 'dev' ? dev : _env === 'prod' ? prod : test,
  REDIS: client
}
