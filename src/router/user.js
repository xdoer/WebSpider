/**
 * 用户信息路由
 */
const Router = require('koa-router')
const { User, Crawl } = require('../model')
const { _debug, _crypto, _uuid, _filter: { isInvalidParam } } = require('../utils')
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
    if (!name || !password || name.toString().length < 3 || password.toString().length < 6 || name.toString().length > 10 || password.toString().length > 20 || isInvalidParam(name) || isInvalidParam(password)) {
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
        data: '参数缺失/昵称长度不够或过长/密码长度不够或过长',
        msg: '参数缺失/昵称长度不够或过长/密码长度不够或过长'
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
          time: '' + Date.now()
        }
        ctx.body = user
      } else {
        _debug(`用户 ${name} 密码错误`, true)
        ctx.body = {
          state: false,
          time: new Date().toLocaleString(),
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
    if (!name || !password || !repeatPassword || password !== repeatPassword || password.toString().length < 6 || password.toString().length > 20 || name.toString().length < 3 || name.toString().length > 10 || isInvalidParam(name) || isInvalidParam(password)) {
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
        data: '参数缺失/密码不匹配/密码长度不够或过长/昵称长度不够或过长',
        msg: '参数缺失/密码不匹配/密码长度不够或过长/昵称长度不够或过长'
      }
      return
    }
    /** 这里注意if条件中括号的添加 */
    if ((await User.get({ name })).state) {
      _debug(`用户名 ${name} 已存在`, true)
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
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
          uid: user.data.uid,
          name: user.data.name,
          time: '' + Date.now()
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
    ctx.session.user = null
    ctx.body = { state: true, time: new Date().toLocaleString(), data: '用户注销成功', msg: '用户注销成功' }
  })
  /**
   * 删除账号操作
   * 删除账号需要验证用户名与密码
   * @param {string} name - 用户名
   * @param {string} password - 密码
   */
  .post('/user/delete', async ctx => {
    const { name, password } = ctx.request.body
    if (!name || !password || isInvalidParam(name) || isInvalidParam(password)) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数缺失', msg: '参数缺失' }; return }
    if (!ctx.session.user) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '用户未登录', msg: '用户未登录' }; return }

    const users = await User.get({ name })
    if (users.data[0].password !== _crypto(password)) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '验证失败', msg: '验证失败' }; return }

    const res = await User.delete({ name })
    if (res.state) {
      ctx.session.user = null
      _debug(`账户 ${name} 删除成功`)
    }
    ctx.body = res

    if (await Crawl.get({ uid: users.data[0].uid }).state) {
      if (await Crawl.delete({ uid: users.data[0].uid }).state) {
        _debug('账户删除，相关配置删除失败', true)
      } else {
        _debug('账户删除，相关配置删除成功')
      }
    }
  })
  /**
   * 用户登录状态查询
   */
  .get('/user/status', ctx => {
    ctx.body = {
      state: Boolean(ctx.session.user),
      data: ctx.session.user,
      msg: '获取登录状态'
    }
  })

module.exports = router
