/**
 * 爬虫配置信息路由
 */

const Router = require('koa-router')
const { Crawl } = require('../model')
const { _debug, _uuid } = require('../utils')
const fetch = require('../crawl')
const getProxies = require('../crawl/proxy')
const verification = require('./utils/verification')
const router = new Router()

router
  /**
   * 用户分享的API接口
   * 传递的参数:page,pageSize
   */
  .get('/crawl/share', async ctx => {
    const { page, pageSize } = ctx.request.query
    const configs = await Crawl.get({}, { fields: { config: 1 }, sort: { time: -1 }, skip: pageSize * page, limit: pageSize })
    if (!configs.state) {
      _debug(`获取爬虫配置失败,失败详情 ${configs.data}`)
      ctx.body = configs
    } else {
      ctx.body = configs
    }
  })
  /**
   * 抓取预览
   * 传递的参数:urls目标网址,tags标签列表,depth抓取深度,form输出形式,charset网页编码,proxies代理
   * @param {string} url 爬取的链接列表
   * @param {array} tags 分析的标签列表
   * @param {string} depth 抓取深度
   * @param {object} form 需要输出的形式
   * @param {string} charset 网页编码(utf-8,gbk)
   * @param {string} proxyMode 代理模式(无代理none，内置代理internal，自定义代理own)
   * @param {array} proxies 可选(自定义代理选项)
   * @param {string} mode 抓取模式(普通模式与分页模式)
   * @param {string} start 分页模式下起始页码
   * @param {string} end 分页模式下终止页码
   */
  .post('/crawl/preview', async ctx => {
    // 前端使用 axios 进行请求，使用 qs 模块格式化 post 请求数据，数字会已字符串进行传递，JSON数据会变成对象
    let { url, tags, depth = '1', form, charset = 'utf-8', proxyMode = 'none', proxies = [], mode = 'plain', start = '0', end = '0' } = ctx.request.body

    // 参数验证
    const dataState = verification({ url, tags, depth, form, charset, proxyMode, proxies, mode, start, end })
    if (!dataState.state) {
      ctx.body = {
        state: false,
        data: dataState.msg,
        msg: '参数验证失败'
      }
      return
    }

    /**
     * 分页请求模式下,构造请求链接数组
     * 链接中的页码部分用*替代
     */
    start = Number.parseInt(start)
    end = Number.parseInt(end)
    let urls = mode === 'pagination' ? (new Array(end - start)).fill(url).map(n => n.replace(/\*/i, start++)) : [url]

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

    // 调用爬虫
    const res = await fetch({ urls, tags, depth: Number.parseInt(depth), form, charset, proxy })
    ctx.body = {
      state: Boolean(res),
      data: res,
      msg: res ? '抓取成功' : '抓取失败'
    }
  })
  /**
   * 保存用户提交的爬虫配置
   * 参数列表如上一个路由，逻辑相同，只不过最后是将数据存到数据库而不是调用爬虫函数
   */
  .post('/crawl/save', async ctx => {
    // 首先判断用户登录状态
    if (!ctx.session.user) return { state: false, data: '未登录', msg: '未登录' }

    // 前端使用 axios 进行请求，使用 qs 模块格式化 post 请求数据，数字会已字符串进行传递，JSON数据会变成对象
    let { url, tags, depth = '1', form, charset = 'utf-8', proxyMode = 'none', proxies = [], mode = 'plain', start = '0', end = '0' } = ctx.request.body

    // 参数验证
    const dataState = verification({ url, tags, depth, form, charset, proxyMode, proxies, mode, start, end })
    if (!dataState.state) {
      ctx.body = {
        state: false,
        data: dataState.msg,
        msg: '参数验证失败'
      }
      return
    }

    /**
     * 分页请求模式下,构造请求链接数组
     * 链接中的页码部分用*替代
     */
    start = Number.parseInt(start)
    end = Number.parseInt(end)
    let urls = mode === 'pagination' ? (new Array(end - start)).fill(url).map(n => n.replace(/\*/i, start++)) : [url]

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

    // 实例化一个爬虫模型对象
    const crawlConfig = new Crawl({
      uid: ctx.session.user.uid,
      cid: _uuid(),
      config: { urls, tags, depth: Number.parseInt(depth), form, charset, proxy }
    })
    ctx.body = await crawlConfig.save()
  })
  /**
   * 获取API函数
   * 提交参数有爬虫配置id
   * 这里还涉及到数据更新的问题
   */
  .get('/crawl/api', async ctx => {

  })

module.exports = router
