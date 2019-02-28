const Router = require('koa-router')
const { Statistics } = require('../model')
const router = new Router()

router.get('/statistics', async ctx => {
  if (ctx.session.user) {
    const { cid } = ctx.request.query
    ctx.body = await Statistics.get({ cid }, { fields: { cid: 1, history: 1, time: 1, count: 1, url: 1 } })
  } else {
    ctx.body = {
      state: false,
      time: new Date().toLocaleString(),
      data: '未登录',
      msg: '未登录'
    }
  }
})

module.exports = router
