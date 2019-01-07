/**
 * 用户信息路由
 */
const Router = require('koa-router')
const { User, Crawl } = require('../model')
const { _debug, _crypto, _uuid } = require('../utils')
const router = new Router()

router
  /**
   * 用户登录
   * POST方式传参:name,password
   * @param {string} name - 用户名
   * @param {string} password - 密码
   */
  .post('/user/login', async ctx => {
    const { name, password } = ctx.request.body
    if (!name || !password || name.toString().length < 3 || password.toString().length < 6) {
      ctx.body = {
        state: false,
        data: '参数缺失/昵称长度不够/密码长度不够',
        msg: '参数缺失/昵称长度不够/密码长度不够'
      }
      return
    }

    const user = await User.get({ name })
    if (!user.state) {
      _debug(`用户 ${name} 未找到`, true)
      ctx.body = user
    } else {
      if (user.data[0].password === _crypto(password)) {
        _debug(`用户 ${name} 登录成功`)
        ctx.session.user = {
          uid: user.data[0].uid,
          name: user.data[0].name,
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
  /**
   * 用户注册
   * POST传入参数:name,password,repeatPassword
   * @param {string} name - 用户名
   * @param {string} password - 密码
   * @param {string} repeatPassword - 重复密码
   */
  .post('/user/register', async ctx => {
    const { name, password, repeatPassword } = ctx.request.body
    /** 检测出参数有误，直接返回 */
    if (!name || !password || !repeatPassword || password !== repeatPassword || password.toString().length < 6 || name.toString().length < 3) {
      ctx.body = {
        state: false,
        data: '参数缺失/密码不匹配/密码长度不够/昵称长度不够',
        msg: '参数缺失/密码不匹配/密码长度不够/昵称长度不够'
      }
      return
    }
    /** 这里注意if条件中括号的添加 */
    if ((await User.get({ name })).state) {
      _debug(`用户名 ${name} 已存在`, true)
      ctx.body = {
        state: false,
        data: `用户名 ${name} 已存在`,
        msg: `用户名 ${name} 已存在`
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
  })
  /**
   * 用户注销账号操作
   */
  .get('/user/logout', async ctx => {
    ctx.session = null
    ctx.body = { state: true, data: '用户注销成功', msg: '用户注销成功' }
  })
  /**
   * 删除账号操作
   * 删除账号需要验证用户名与密码
   */
  .post('/user/delete', async ctx => {
    const { name, password } = ctx.body.request
    if (ctx.session.user.name !== name) return { state: false, data: '验证失败', msg: '验证失败' }
    const users = await User.get({ name })
    if (users[0].password === _crypto(password)) {
      const crawl = await Crawl.delete({ uid: users[0].uid })
      if (crawl.state) {
        ctx.body = await User.delete({ name })
      } else {
        ctx.body = {
          state: false,
          data: '相关爬虫配置删除失败,请联系站长',
          msg: '删除失败'
        }
      }
    } else {
      return { state: false, data: '验证失败', msg: '验证失败' }
    }
  })

module.exports = router
