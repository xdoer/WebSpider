/**
 * 代理路由
 * 对外提供API接口
 */

const Router = require('koa-router')
const { _filter: { filterUrl } } = require('../utils')
const { proxyXiCi, proxyFreeList } = require('../data/config')
const { REDIS, API: { PROXY_FREQUENCY} } = require('../config')
const superagent = require('superagent')
require('superagent-proxy')(superagent)
const crawl = require('../crawl')
const async = require('async')
const router = new Router()


router
  .get('/proxy', async ctx => {
    const { time, type } = ctx.request.query

    let t = Number.parseInt(time)
    if(['1', '2'].indexOf(type) === -1 || Number.isNaN(t)) {
      ctx.body = { state: false, time: new Date(), data: '参数错误', msg: 'type参数为1或者2，代表代理来源于西刺代理还是国外代理,time参数为数字，代表测试请求的超时时间' }
      return
    }
    
    // API调用频率限制
    if (PROXY_FREQUENCY) {
      const name = `${ctx.request.url}_${ctx.request.ip.replace(/::ffff:/, '')}_proxy`
      if (await REDIS.getAsync(name)) {
        ctx.body = { state: false, time: new Date(), data: '请求频率限制', msg: '请求频率限制' }
        return
      } else {
        await REDIS.setAsync(name, true)
        REDIS.expire(name, PROXY_FREQUENCY)
      }    
    }
    
    // 获取所有代理地址
    const config = type === '1' ? proxyXiCi : type === '2' ? proxyFreeList : proxyXiCi    
    const proxies =  await crawl(config)

    if (!proxies.state) { 
      ctx.body = {
        state: false, 
        time: new Date(),
        data: '代理获取失败',
        msg: '服务器可能连接不到免费代理站点,因而服务不可用'
      }
      return
    }

    ctx.body = await new Promise(function (resolve, reject) {
      async.mapLimit(proxies.data, 100, (proxy, fn) => {
        const _proxy = `http://${proxy.ip}:${proxy.port}`
        superagent.get('http://ip-api.com/json').timeout(t).proxy(_proxy).buffer(true).end((err, res) => {
          if (err) {
            fn(null, '')
          } else {
            if (res.body['status'] === 'success') {
              fn(null, _proxy) 
            } else {
              fn(null, '')
            }
          }
        })
      }, (err, res) => {
          resolve({
            state: true,
            time: new Date(),
            data: [...new Set(res)].filter(n => n !== '' || filterUrl(n)),
            msg: '可用代理筛选完毕'
          });
      })
    })
  })

module.exports = router
