/**
 * 代理路由
 * 对外提供API接口
 * 直接从代理文件中获取代理(/data/proxies.json)
 */

const Router = require('koa-router')
const { REDIS, API: { PROXY_FREQUENCY }, PROXY: { interval } } = require('../config')
const getProxy = require('../proxy')
const router = new Router()

router
  .get('/proxy', async ctx => {
    // API调用频率限制
    if (PROXY_FREQUENCY) {
      const name = `${ctx.request.url}_${ctx.request.ip.replace(/::ffff:/, '')}_proxy`
      if (await REDIS.getAsync(name)) {
        ctx.body = { state: false, time: new Date().toLocaleString(), data: '请求频率限制', msg: '请求频率限制' }
        return
      } else {
        await REDIS.setAsync(name, true)
        REDIS.expire(name, PROXY_FREQUENCY)
      }
    }

    let result
    try {
      result = await getProxy()
    } catch (e) {
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
        data: '代理获取失败',
        msg: e
      }
      return
    }
    ctx.body = {
      state: true,
      time: new Date().toLocaleString(),
      data: result,
      msg: `代理获取成功,数据每${interval}秒更新一次`
    }
  })

module.exports = router
