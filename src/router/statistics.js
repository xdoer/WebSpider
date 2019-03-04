const Router = require('koa-router')
const { Statistics } = require('../model')
const { _filter: { isInvalidParam } } = require('../utils')
const router = new Router()

router.get('/statistics', async ctx => {
  if (!ctx.session.user) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '未登录', msg: '未登录' }; return }
  const { cid } = ctx.request.query
  if (!cid || isInvalidParam(cid)) {
    ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数缺失或参数验证失败', msg: '参数缺失或参数验证失败' }
    return
  }
  ctx.body = await Statistics.get({ cid }, { fields: { cid: 1, history: 1, time: 1, count: 1, url: 1 } })
})

module.exports = router
