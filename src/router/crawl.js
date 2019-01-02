/**
 * 爬虫配置信息路由
 */

const Router = require('koa-router')
const router = new Router()

router.get('/a', ctx => {
  ctx.body = 2
})

module.exports = router
