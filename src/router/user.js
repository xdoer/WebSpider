/**
 * 用户信息路由
 */
const Router = require('koa-router')
const { User } = require('../model')
const { _debug, _crypto, _uuid } = require('../utils')
const router = new Router()

router
  .post('/login', async ctx => {
    /**
     * 用户登录
     * POST方式传参:name,password
     * @param {string} name - 用户名
     * @param {string} password - 密码
     */
    const { name, password } = ctx.request.body
    const user = User.get({ name })
    if (!user.state) {
      _debug(`用户 ${name} 未找到`, true)
      ctx.body = user
    } else {
      if (user.data.password === _crypto(password)) {
        _debug(`用户 ${name} 登录成功`)
        ctx.session.user = {
          id: user.data.id,
          name: user.data.name,
          time: Date.now()
        }
        ctx.body = user
      } else {
        _debug(`用户 ${name} 密码错误`, true)
        ctx.body = {
          state: false,
          data: '用户名或密码不匹配',
          msg: '用户名或密码不匹配'
        }
      }
    }
  })
  .post('/register', async ctx => {
    /**
     * 用户注册
     * POST传入参数:name,password,repeatPassword
     * @param {string} name - 用户名
     * @param {string} password - 密码
     * @param {string} repeatPassword - 重复密码
     */
    const { name, password, repeatPassword } = ctx.request.body
    if (password !== repeatPassword) {
      _debug('两次密码不一致', true)
      ctx.body = {
        state: false,
        data: '两次密码不一致',
        msg: '两次密码不一致'
      }
    } else {
      if (User.get({ name }).state) {
        _debug('用户名已存在', true)
        ctx.body = {
          state: false,
          data: '用户名已存在',
          msg: '用户名已存在'
        }
      } else {
        const user = await new User({
          uid: _uuid(),
          name: name,
          password: _crypto(password)
        }).save()
        if (user.state) {
          _debug(`用户 ${name} 注册成功`)
          ctx.session.user = {
            id: user.data.id,
            name: user.data.name,
            time: Date.now()
          }
        } else {
          _debug(`用户 ${name} 注册失败, 失败详情 ${user.data}`, true)
        }
        ctx.body = user
      }
    }
  })

module.exports = router
