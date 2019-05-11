/**
 * 爬虫配置信息路由
 */

const Router = require('koa-router')
const { Crawl } = require('../model')
const { _debug, _uuid, _statistics, _isNaN, _filter } = require('../utils')
const { STATISTICS, API: { API_FREQUENCY, PREVIEW_FREQUENCY }, REDIS } = require('../config')
const fetch = require('../crawl')
const getProxies = require('../proxy')
const verification = require('./utils/verification')
const router = new Router()

router
  /**
   * 抓取预览
   * @param {string} url 爬取的链接列表
   * @param {array} tags 分析的标签列表
   * @param {string} depth 抓取深度
   * @param {object} form 需要输出的形式
   * @param {string} charset 网页编码(utf-8,gbk)
   * @param {string} proxyMode 代理模式(无代理none，内置代理internal，自定义代理own)
   * @param {array} proxies 自定义代理提交的代理
   * @param {string} mode 抓取模式(普通模式与分页模式)
   * @param {string} start 分页模式下起始页码
   * @param {string} end 分页模式下终止页码
   */
  .post('/crawl/preview', async ctx => {
    // 前端使用 axios 进行请求，使用 qs 模块格式化 post 请求数据，数字会以字符串形式进行传递，JSON数据会变成对象
    let { url, tags, depth = '1', form, charset = 'utf-8', proxyMode = 'none', proxies = [], mode = 'plain', start = '0', end = '0' } = ctx.request.body

    // 参数验证
    const dataState = verification({ url, tags, depth, form, charset, proxyMode, proxies, mode, start, end })
    if (!dataState.state) { ctx.body = { state: false, time: new Date().toLocaleString(), data: dataState.msg, msg: '参数验证失败' }; return }

    /**
     * 分页请求模式下,构造请求链接数组
     * 链接中的页码部分用*替代
     */
    start = Number.parseInt(start)
    end = Number.parseInt(end)
    let urls = mode === 'pagination' ? (new Array(end - start)).fill(url).map(n => n.replace(/\*/i, start++)) : [url]

    // 启用API调用频率限制
    if (PREVIEW_FREQUENCY) {
      const name = `${ctx.request.url}_${ctx.request.ip.replace(/::ffff:/, '')}_preview`
      // 请求频率处理
      if (await REDIS.getAsync(name)) {
        ctx.body = { state: false, time: new Date().toLocaleString(), data: '请求频率限制', msg: '请求频率限制' }
        return
      } else {
        await REDIS.setAsync(name, true)
        REDIS.expire(name, PREVIEW_FREQUENCY)
      }
    }

    /**
     * 代理模式
     * 内置代理模式,用户配置的代理,不使用代理
     */
    let proxy
    if (proxyMode === 'internal') {
      let _proxies = await getProxies()
      proxy = _proxies[Math.floor(Math.random() * _proxies.length + 1) - 1]
    } else if (proxyMode === 'own') {
      proxy = proxies[Math.floor(Math.random() * proxies.length + 1) - 1]
    }

    form = process.env.NODE_ENV === 'test' ? form : JSON.parse(form)

    try {
      // 调用爬虫
      const res = await fetch({ urls, tags, depth: Number.parseInt(depth), form, charset, proxy })

      ctx.body = {
        state: res.state,
        time: new Date().toLocaleString(),
        data: res.data,
        msg: res.state ? '抓取成功' : '抓取失败'
      }
    } catch (e) {
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
        data: e,
        msg: '爬虫抓取数据出错'
      }
    }
  })
  /**
   * 保存用户提交的爬虫配置
   * 其他参数列表如上一个路由
   */
  .post('/crawl/save', async ctx => {
    // 首先判断用户登录状态
    if (!ctx.session.user) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '未登录', msg: '未登录' }; return }

    // 前端使用 axios 进行请求，使用 qs 模块格式化 post 请求数据，数字会已字符串进行传递，JSON数据会变成对象
    let { url, tags, depth = '1', form, charset = 'utf-8', proxyMode = 'none', proxies = [], mode = 'plain', start = '0', end = '0' } = ctx.request.body

    // 参数验证
    const dataState = verification({ url, tags, depth, form, charset, proxyMode, proxies, mode, start, end })
    if (!dataState.state) { ctx.body = { state: false, time: new Date().toLocaleString(), data: dataState.msg, msg: '参数验证失败' }; return }

    form = process.env.NODE_ENV === 'test' ? form : JSON.parse(form)

    // 实例化一个爬虫模型对象
    const crawlConfig = new Crawl({
      uid: ctx.session.user.uid,
      author: ctx.session.user.name,
      cid: _uuid(),
      interval: 0,
      config: { url, tags, depth: Number.parseInt(depth), form, charset, proxyMode, proxies, mode, start, end }
    })
    ctx.body = await crawlConfig.save()
  })
  /**
   * 用户分享的API接口
   * @param {String} page 分页页码
   * @param {String} pageSize 页面大小
   */
  .get('/crawl/share', async ctx => {
    let { page = 1, pageSize = 10 } = ctx.request.query
    if (_isNaN(page) || _isNaN(pageSize)) {
      ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数错误', msg: '参数包含page,pageSize,且都为数字' }
      return
    }
    page = Number.parseInt(page)
    pageSize = Number.parseInt(pageSize)
    ctx.body = await Crawl.get({ permission: true }, { fields: { 'config.url': 1, interval: 1, tag: 1, description: 1, author: 1, cid: 1 }, sort: { time: -1 }, limit: pageSize, skip: pageSize * page })
  })
  /**
   * 获取API函数
   * @param {String} user 用户名
   * @param {String} cid 配置ID
   */
  .get('/crawl/api', async ctx => {
    const { user, cid } = ctx.request.query

    // 参数完整性
    if (!user || !cid || _filter.isInvalidParam(user) || _filter.isInvalidParam(cid)) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数不完整', msg: '请求失败' }; return }

    // 根据参数从数据库获取数据
    const _configs = await Crawl.get({ cid })

    let { author, time, interval, result, config: { url, proxyMode, proxies, mode, start, end } } = _configs.data[0]

    // 链接中的用户 id 和爬虫配置中的用户id不匹配
    if (user !== author) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数错误', msg: '用户名与配置ID不匹配' }; return }

    // API调用统计信息
    if (STATISTICS) {
      _statistics({ path: ctx.request.url, cid, time })
    }

    // 启用API调用频率限制
    if (API_FREQUENCY) {
      const name = `${ctx.request.url}_${ctx.request.ip.replace(/::ffff:/, '')}_api`
      // 请求频率处理
      if (await REDIS.getAsync(name)) {
        ctx.body = { state: false, time: new Date().toLocaleString(), data: '请求评率限制', msg: '请求频率限制' }
        return
      } else {
        await REDIS.setAsync(name, true)
        REDIS.expire(name, API_FREQUENCY)
      }
    }

    /**
     * 如果没配置更新(即 interval 值为0)时，且数据库中有结果数据，则直接从数据库中读取数据返回
     * 如果配置了更新,判断当前时间与数据库中的数据更新时间，值大于interval间隔，则调用爬虫，并更新数据库数据，值小于interval，则直接返回数据库数据
     */
    if (!interval && result.value.length > 0) {
      ctx.body = { state: true, time: new Date(Number.parseInt(result.time)).toLocaleString(), data: result.value, msg: '请求成功' }
    } else {
      const t = (Date.now() - Number.parseInt(result.time)) / (1000 * 60 * 60)
      // 如果当前API请求时间大于用户配置的更新时间,则调用爬虫
      if (t > interval) {
        // 处理代理
        let proxy
        if (proxyMode === 'internal') {
          let _proxies = await getProxies()
          proxy = _proxies[Math.floor(Math.random() * _proxies.length + 1) - 1]
        } else if (proxyMode === 'own') {
          proxy = proxies[Math.floor(Math.random() * proxies.length + 1) - 1]
        }

        let urls = mode === 'pagination' ? (new Array(end - start)).fill(url).map(n => n.replace(/\*/i, start++)) : [url]

        /**
         * 数据库中保存的配置参数:url, tags, depth, form, charset, proxyMode, proxies, mode, start, end
         * 爬虫需要的参数:urls, tags, depth, form, charset, proxy
         */
        const res = await fetch(Object.assign({}, _configs.data[0].config, { proxy, urls }))
        ctx.body = { state: res.state, time: new Date().toLocaleString(), data: res.data, msg: res.state ? '请求成功' : '请求失败' }

        const m = await Crawl.update({ cid }, { result: { time: '' + Date.now(), value: res.data } })
        if (!m.state) {
          _debug('API调用,爬虫结果更新失败', true)
        }
      } else {
        ctx.body = { state: true, time: new Date(Number.parseInt(result.time)).toLocaleString(), data: result.value, msg: '请求成功' }
      }
    }
  })
  /**
   * 配置删除
   * @param {string} cid - 配置ID
   */
  .delete('/crawl/config', async ctx => {
    if (!ctx.session.user) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '未登录', msg: '未登录' }; return }
    const { cid } = ctx.request.query
    if (!cid || _filter.isInvalidParam(cid)) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数缺失', msg: '参数缺失' }; return }
    const res = await Crawl.get({ cid })
    if (res.state) {
      ctx.body = await Crawl.delete({ cid })
    } else {
      ctx.body = { state: false, time: new Date().toLocaleString(), data: res.data, msg: res.msg }
    }
  })
  /**
   * 登录后，获取
   * @param {String} page 分页页码
   * @param {String} pageSize 页面大小
   */
  .get('/crawl/config', async ctx => {
    if (!ctx.session.user) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '未登录', msg: '未登录' }; return }
    let { page, pageSize } = ctx.request.query
    if (_isNaN(page) || _isNaN(pageSize)) {
      ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数错误', msg: '参数包含page,pageSize,且都为数字' }
      return
    }
    page = Number.parseInt(page)
    pageSize = Number.parseInt(pageSize)
    ctx.body = await Crawl.get({ uid: ctx.session.user.uid }, { fields: { config: 1, interval: 1, tag: 1, description: 1, author: 1, cid: 1, permission: 1 }, sort: { time: -1 }, skip: pageSize * page, limit: pageSize })
  })
  /**
   * 更新配置
   * API描述，标签，功能...
   * @param {String} cid 配置ID(必选)
   * @param {String} permission 权限(可选)
   * @param {Array} tag API标签(可选)
   * @param {String} description API描述信息(可选)
   * @param {String} interval 更新间隔(可选)
   */
  .post('/crawl/config', async ctx => {
    if (!ctx.session.user) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '未登录', msg: '未登录' }; return }
    const { cid, permission, tag, description, interval } = ctx.request.body
    if (!cid) { ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数缺失', msg: '参数必须包含cid' }; return }

    const obj = {}
    if (permission) {
      obj.permission = permission === 'true' || false
    }
    if (tag && !_filter.isInvalidParam(tag)) obj.tag = tag
    if (description && !_filter.isInvalidParam(description)) obj.description = description
    if (interval && !_filter.isInvalidParam(interval)) obj.interval = _isNaN(interval) ? 0 : Number.parseInt(interval)

    ctx.body = await Crawl.update({ cid }, obj)
  })
  /**
   * 获取某一个标签类别的
   * @param {String} page 分页页码
   * @param {String} pageSize 页面大小
   * @param {String} tag API标签
   */
  .get('/crawl/tag', async ctx => {
    const { page = 0, pageSize = 10, tag } = ctx.request.query
    if (_isNaN(page) || _isNaN(pageSize)) {
      ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数错误', msg: '参数包含page,pageSize,且都为数字' }
      return
    }
    if (Object.prototype.toString.call(tag) !== '[object String]' && _filter.isInvalidParam(tag)) {
      ctx.body = { state: false, time: new Date().toLocaleString(), data: '参数错误', msg: '参数tag应当为字符串且不含敏感关键字' }
      return
    }
    ctx.body = await Crawl.get({ tag }, { fields: { 'config.url': 1, interval: 1, tag: 1, description: 1, cid: 1, author: 1 }, sort: { time: -1 }, limit: Number.parseInt(pageSize), skip: Number.parseInt(pageSize) * Number.parseInt(page) })
  })

module.exports = router
