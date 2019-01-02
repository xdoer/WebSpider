/**
 * 用户信息路由
 */

const Router = require('koa-router')
const { User } = require('../model')
const router = new Router()

router
  .post('/login', async ctx => {
    ctx.body = 1
  })
  .post('/register', async ctx => {
    /**
     * 检测提交的参数
     */
    const { name, password, repeatPassword } = ctx.request
    if (password !== repeatPassword) {

    } else {
      const user = new User({
        uid: Date.now(),
        name
      })
      await user.save()
      ctx.body = 2
    }
  })

module.exports = router
